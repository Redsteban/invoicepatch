# InvoicePatch Integration Platform - Phase 1 Implementation Guide
## QuickBooks Online Integration & Manager Dashboard

### Overview

Phase 1 establishes the foundation for the InvoicePatch Integration Platform by implementing:
1. **QuickBooks Online Integration** - Primary accounting system connector
2. **Basic Manager Dashboard** - Real-time contractor tracking
3. **Core Integration Engine** - Scalable foundation for future integrations
4. **Enhanced Mobile App** - Contractor time tracking and work order management

## 1. QuickBooks Online Integration Implementation

### 1.1 Authentication Flow

```typescript
// OAuth 2.0 flow for QuickBooks Online
class QuickBooksAuthService {
  private readonly DISCOVERY_DOCUMENT_URL = 'https://developer.api.intuit.com/.well-known/v2/discovery_document_sandbox';
  
  async initiateAuthFlow(clientId: string, redirectUri: string): Promise<string> {
    const state = this.generateSecureState();
    const scope = 'com.intuit.quickbooks.accounting';
    
    const authUrl = new URL('https://appcenter.intuit.com/connect/oauth2');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('scope', scope);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('access_type', 'offline');
    authUrl.searchParams.set('state', state);
    
    await this.storeState(state);
    return authUrl.toString();
  }
  
  async exchangeCodeForTokens(code: string, state: string): Promise<QBTokens> {
    await this.validateState(state);
    
    const response = await fetch('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI
      })
    });
    
    return response.json();
  }
}
```

### 1.2 Core QuickBooks Connector

```typescript
class QuickBooksConnector {
  constructor(
    private tokens: QBTokens,
    private companyId: string,
    private environment: 'sandbox' | 'production' = 'sandbox'
  ) {}
  
  private get baseURL(): string {
    return this.environment === 'sandbox' 
      ? 'https://sandbox-quickbooks.api.intuit.com'
      : 'https://quickbooks.api.intuit.com';
  }
  
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}/v3/company/${this.companyId}/${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.tokens.access_token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    if (!response.ok) {
      throw new QuickBooksAPIError(response.status, await response.text());
    }
    
    const data = await response.json();
    return data.QueryResponse || data;
  }
  
  // Customer Management
  async syncCustomers(): Promise<QBCustomer[]> {
    const response = await this.makeRequest<{Customer: QBCustomer[]}>('customers');
    return response.Customer || [];
  }
  
  async createCustomer(customerData: CreateCustomerRequest): Promise<QBCustomer> {
    const customer = {
      Name: customerData.name,
      CompanyName: customerData.companyName,
      BillAddr: {
        Line1: customerData.address.line1,
        City: customerData.address.city,
        CountrySubDivisionCode: customerData.address.province,
        PostalCode: customerData.address.postalCode,
        Country: 'Canada'
      },
      PrimaryEmailAddr: {
        Address: customerData.email
      },
      PrimaryPhone: {
        FreeFormNumber: customerData.phone
      }
    };
    
    const response = await this.makeRequest<{Customer: QBCustomer}>('customers', {
      method: 'POST',
      body: JSON.stringify({ Customer: customer })
    });
    
    return response.Customer;
  }
  
  // Invoice Operations
  async createInvoice(invoiceData: CreateInvoiceRequest): Promise<QBInvoice> {
    const invoice = {
      CustomerRef: { value: invoiceData.customerId },
      Line: invoiceData.lineItems.map((item, index) => ({
        Id: (index + 1).toString(),
        LineNum: index + 1,
        Amount: item.amount,
        DetailType: 'SalesItemLineDetail',
        SalesItemLineDetail: {
          ItemRef: { value: item.itemId },
          Qty: item.quantity,
          UnitPrice: item.rate
        }
      })),
      TxnDate: invoiceData.invoiceDate,
      DueDate: invoiceData.dueDate,
      DocNumber: invoiceData.invoiceNumber,
      PrivateNote: invoiceData.notes
    };
    
    const response = await this.makeRequest<{Invoice: QBInvoice}>('invoices', {
      method: 'POST',
      body: JSON.stringify({ Invoice: invoice })
    });
    
    return response.Invoice;
  }
  
  // Project/Job Tracking
  async syncProjects(): Promise<QBClass[]> {
    const response = await this.makeRequest<{Class: QBClass[]}>('classes');
    return response.Class || [];
  }
  
  async createProject(projectData: CreateProjectRequest): Promise<QBClass> {
    const project = {
      Name: projectData.name,
      SubClass: projectData.parentId ? false : true,
      ParentRef: projectData.parentId ? { value: projectData.parentId } : undefined,
      Active: true
    };
    
    const response = await this.makeRequest<{Class: QBClass}>('classes', {
      method: 'POST',
      body: JSON.stringify({ Class: project })
    });
    
    return response.Class;
  }
  
  // Time Tracking
  async createTimeActivity(timeData: CreateTimeActivityRequest): Promise<QBTimeActivity> {
    const timeActivity = {
      TxnDate: timeData.date,
      EmployeeRef: { value: timeData.contractorId },
      CustomerRef: { value: timeData.customerId },
      ItemRef: { value: timeData.serviceItemId },
      ClassRef: timeData.projectId ? { value: timeData.projectId } : undefined,
      Hours: timeData.hours,
      Minutes: timeData.minutes,
      Description: timeData.description,
      Billable: timeData.billable,
      HourlyRate: timeData.hourlyRate
    };
    
    const response = await this.makeRequest<{TimeActivity: QBTimeActivity}>('timeactivities', {
      method: 'POST',
      body: JSON.stringify({ TimeActivity: timeActivity })
    });
    
    return response.TimeActivity;
  }
}
```

### 1.3 Integration Service Layer

```typescript
class IntegrationService {
  constructor(
    private qbConnector: QuickBooksConnector,
    private database: Database,
    private eventBus: EventBus
  ) {}
  
  async syncWorkOrderToProject(workOrder: WorkOrder): Promise<void> {
    try {
      // 1. Check if customer exists in QuickBooks
      let qbCustomer = await this.findOrCreateCustomer(workOrder.client);
      
      // 2. Check if project exists
      let qbProject = await this.findOrCreateProject(workOrder, qbCustomer.Id);
      
      // 3. Update local mapping
      await this.database.workOrders.update(workOrder.id, {
        qbCustomerId: qbCustomer.Id,
        qbProjectId: qbProject.Id,
        syncStatus: 'synced',
        lastSyncAt: new Date()
      });
      
      // 4. Emit sync event
      this.eventBus.emit('workorder.synced', {
        workOrderId: workOrder.id,
        qbCustomerId: qbCustomer.Id,
        qbProjectId: qbProject.Id
      });
      
    } catch (error) {
      await this.handleSyncError(workOrder.id, error);
    }
  }
  
  async syncTimeEntriesToQuickBooks(contractorId: string, dateRange: DateRange): Promise<void> {
    const timeEntries = await this.database.timeEntries.findByContractorAndDate(
      contractorId, 
      dateRange.start, 
      dateRange.end
    );
    
    for (const timeEntry of timeEntries) {
      if (timeEntry.qbTimeActivityId) continue; // Already synced
      
      try {
        const qbTimeActivity = await this.qbConnector.createTimeActivity({
          date: timeEntry.date,
          contractorId: timeEntry.qbEmployeeId,
          customerId: timeEntry.workOrder.qbCustomerId,
          serviceItemId: timeEntry.serviceType.qbItemId,
          projectId: timeEntry.workOrder.qbProjectId,
          hours: Math.floor(timeEntry.duration / 60),
          minutes: timeEntry.duration % 60,
          description: timeEntry.description,
          billable: timeEntry.billable,
          hourlyRate: timeEntry.rate
        });
        
        await this.database.timeEntries.update(timeEntry.id, {
          qbTimeActivityId: qbTimeActivity.Id,
          syncStatus: 'synced'
        });
        
      } catch (error) {
        console.error(`Failed to sync time entry ${timeEntry.id}:`, error);
      }
    }
  }
  
  async generateInvoiceFromTimeEntries(contractorId: string, dateRange: DateRange): Promise<Invoice> {
    // 1. Get approved time entries
    const timeEntries = await this.database.timeEntries.findApproved(contractorId, dateRange);
    
    // 2. Group by customer and service type
    const invoiceData = this.groupTimeEntriesForInvoicing(timeEntries);
    
    // 3. Generate invoice in local system
    const localInvoice = await this.database.invoices.create({
      contractorId,
      clientId: invoiceData.customerId,
      lineItems: invoiceData.lineItems,
      subtotal: invoiceData.subtotal,
      taxes: invoiceData.taxes,
      total: invoiceData.total,
      status: 'draft'
    });
    
    // 4. Create invoice in QuickBooks
    const qbInvoice = await this.qbConnector.createInvoice({
      customerId: invoiceData.qbCustomerId,
      lineItems: invoiceData.lineItems.map(item => ({
        itemId: item.qbItemId,
        quantity: item.quantity,
        rate: item.rate,
        amount: item.amount,
        description: item.description
      })),
      invoiceDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      invoiceNumber: localInvoice.invoiceNumber,
      notes: localInvoice.notes
    });
    
    // 5. Update local invoice with QB reference
    await this.database.invoices.update(localInvoice.id, {
      qbInvoiceId: qbInvoice.Id,
      status: 'sent',
      syncStatus: 'synced'
    });
    
    return localInvoice;
  }
}
```

## 2. Manager Dashboard Implementation

### 2.1 Real-time Contractor Tracking

```typescript
// WebSocket service for real-time updates
class RealtimeService {
  private io: Server;
  private contractorConnections = new Map<string, string>(); // contractorId -> socketId
  
  constructor(server: http.Server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
        methods: ['GET', 'POST']
      }
    });
    
    this.setupEventHandlers();
  }
  
  private setupEventHandlers(): void {
    this.io.on('connection', (socket) => {
      socket.on('contractor:connect', (contractorId: string) => {
        this.contractorConnections.set(contractorId, socket.id);
        socket.join(`contractor:${contractorId}`);
      });
      
      socket.on('location:update', (data: LocationUpdate) => {
        this.handleLocationUpdate(socket, data);
      });
      
      socket.on('timeentry:start', (data: TimeEntryStart) => {
        this.handleTimeEntryStart(socket, data);
      });
      
      socket.on('timeentry:stop', (data: TimeEntryStop) => {
        this.handleTimeEntryStop(socket, data);
      });
      
      socket.on('disconnect', () => {
        this.handleDisconnect(socket);
      });
    });
  }
  
  async handleLocationUpdate(socket: Socket, data: LocationUpdate): Promise<void> {
    const contractorId = this.getContractorIdBySocket(socket.id);
    if (!contractorId) return;
    
    // Update contractor location in database
    await this.database.contractors.updateLocation(contractorId, {
      latitude: data.latitude,
      longitude: data.longitude,
      accuracy: data.accuracy,
      timestamp: new Date()
    });
    
    // Notify manager dashboard
    this.io.to('managers').emit('contractor:location_updated', {
      contractorId,
      location: data,
      timestamp: new Date()
    });
  }
  
  async handleTimeEntryStart(socket: Socket, data: TimeEntryStart): Promise<void> {
    const contractorId = this.getContractorIdBySocket(socket.id);
    if (!contractorId) return;
    
    const timeEntry = await this.database.timeEntries.create({
      contractorId,
      workOrderId: data.workOrderId,
      startTime: new Date(),
      status: 'active',
      location: data.location
    });
    
    // Notify manager dashboard
    this.io.to('managers').emit('timeentry:started', {
      contractorId,
      timeEntryId: timeEntry.id,
      workOrder: timeEntry.workOrder,
      startTime: timeEntry.startTime
    });
  }
}
```

### 2.2 Dashboard UI Components

```typescript
// Real-time contractor map component
const ContractorTrackingMap: React.FC = () => {
  const [contractors, setContractors] = useState<ContractorLocation[]>([]);
  const socketRef = useRef<Socket>();
  
  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io('/managers');
    
    socketRef.current.on('contractor:location_updated', (update: LocationUpdate) => {
      setContractors(prev => 
        prev.map(contractor => 
          contractor.id === update.contractorId 
            ? { ...contractor, location: update.location, lastUpdate: update.timestamp }
            : contractor
        )
      );
    });
    
    socketRef.current.on('timeentry:started', (data: TimeEntryStarted) => {
      setContractors(prev =>
        prev.map(contractor =>
          contractor.id === data.contractorId
            ? { ...contractor, status: 'working', currentJob: data.workOrder }
            : contractor
        )
      );
    });
    
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);
  
  return (
    <div className="h-96 w-full bg-gray-100 rounded-lg relative">
      <MapContainer 
        center={[43.6532, -79.3832]} // Toronto
        zoom={10}
        className="h-full w-full rounded-lg"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        
        {contractors.map(contractor => (
          <ContractorMarker
            key={contractor.id}
            contractor={contractor}
          />
        ))}
      </MapContainer>
    </div>
  );
};

// Individual contractor marker
const ContractorMarker: React.FC<{contractor: ContractorLocation}> = ({ contractor }) => {
  const getMarkerColor = (status: ContractorStatus): string => {
    switch (status) {
      case 'working': return 'green';
      case 'available': return 'blue';
      case 'break': return 'yellow';
      case 'offline': return 'gray';
      default: return 'blue';
    }
  };
  
  return (
    <Marker
      position={[contractor.location.latitude, contractor.location.longitude]}
      icon={L.divIcon({
        html: `
          <div class="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white shadow-lg bg-${getMarkerColor(contractor.status)}-500">
            <span class="text-white text-xs font-bold">${contractor.name.charAt(0)}</span>
          </div>
        `,
        className: 'contractor-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      })}
    >
      <Popup>
        <div className="p-2">
          <h3 className="font-semibold">{contractor.name}</h3>
          <p className="text-sm text-gray-600">Status: {contractor.status}</p>
          {contractor.currentJob && (
            <p className="text-sm">Job: {contractor.currentJob.description}</p>
          )}
          <p className="text-xs text-gray-500">
            Last update: {new Date(contractor.lastUpdate).toLocaleTimeString()}
          </p>
        </div>
      </Popup>
    </Marker>
  );
};

// Live time tracking dashboard
const LiveTimeTracking: React.FC = () => {
  const [activeTimeEntries, setActiveTimeEntries] = useState<ActiveTimeEntry[]>([]);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ClockIcon className="h-5 w-5 text-blue-600" />
          <span>Live Time Tracking</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeTimeEntries.map(entry => (
            <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${entry.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                <div>
                  <p className="font-medium">{entry.contractorName}</p>
                  <p className="text-sm text-gray-600">{entry.workOrder.description}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-mono text-lg">
                  {formatDuration(entry.elapsedTime)}
                </p>
                <p className="text-sm text-gray-600">
                  Started: {new Date(entry.startTime).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          
          {activeTimeEntries.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No active time entries
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
```

### 2.3 Approval Workflow

```typescript
// Invoice approval system
class InvoiceApprovalService {
  async getInvoicesPendingApproval(managerId: string): Promise<PendingInvoice[]> {
    return this.database.invoices.findPendingApproval({
      managerId,
      status: 'pending',
      includeTimeEntries: true,
      includeValidationResults: true
    });
  }
  
  async validateInvoiceForApproval(invoiceId: string): Promise<ValidationResult> {
    const invoice = await this.database.invoices.findById(invoiceId);
    const timeEntries = await this.database.timeEntries.findByInvoice(invoiceId);
    
    const validationRules = [
      this.validateTimeEntryOverlaps,
      this.validateRateConsistency,
      this.validateProjectBudgets,
      this.validateGeolocation,
      this.validateDuplicates
    ];
    
    const results = await Promise.all(
      validationRules.map(rule => rule(invoice, timeEntries))
    );
    
    return {
      isValid: results.every(r => r.passed),
      issues: results.filter(r => !r.passed),
      warnings: results.filter(r => r.severity === 'warning'),
      errors: results.filter(r => r.severity === 'error')
    };
  }
  
  async approveInvoice(invoiceId: string, managerId: string, notes?: string): Promise<void> {
    const validation = await this.validateInvoiceForApproval(invoiceId);
    
    if (!validation.isValid && validation.errors.length > 0) {
      throw new Error('Cannot approve invoice with validation errors');
    }
    
    await this.database.transaction(async (tx) => {
      // Update invoice status
      await tx.invoices.update(invoiceId, {
        status: 'approved',
        approvedBy: managerId,
        approvedAt: new Date(),
        approvalNotes: notes
      });
      
      // Mark time entries as billed
      await tx.timeEntries.updateByInvoice(invoiceId, {
        billingStatus: 'billed',
        billedAt: new Date()
      });
      
      // Create audit log
      await tx.auditLogs.create({
        action: 'invoice.approved',
        entityType: 'invoice',
        entityId: invoiceId,
        performedBy: managerId,
        timestamp: new Date(),
        details: { notes, validationResults: validation }
      });
    });
    
    // Sync to QuickBooks if connected
    if (this.qbConnector) {
      await this.integrationService.syncApprovedInvoice(invoiceId);
    }
    
    // Notify contractor
    await this.notificationService.sendInvoiceApproved(invoiceId);
  }
  
  async bulkApproveInvoices(invoiceIds: string[], managerId: string): Promise<BulkApprovalResult> {
    const results: BulkApprovalResult = {
      successful: [],
      failed: [],
      warnings: []
    };
    
    for (const invoiceId of invoiceIds) {
      try {
        const validation = await this.validateInvoiceForApproval(invoiceId);
        
        if (validation.errors.length > 0) {
          results.failed.push({
            invoiceId,
            reason: 'Validation errors',
            errors: validation.errors
          });
          continue;
        }
        
        if (validation.warnings.length > 0) {
          results.warnings.push({
            invoiceId,
            warnings: validation.warnings
          });
        }
        
        await this.approveInvoice(invoiceId, managerId);
        results.successful.push(invoiceId);
        
      } catch (error) {
        results.failed.push({
          invoiceId,
          reason: error.message,
          error
        });
      }
    }
    
    return results;
  }
}
```

## 3. Mobile App Enhancements

### 3.1 Work Order Management

```typescript
// Enhanced work order component for contractors
const WorkOrderList: React.FC = () => {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  
  const syncWorkOrders = async () => {
    setRefreshing(true);
    try {
      const response = await api.get('/contractors/work-orders');
      setWorkOrders(response.data);
    } catch (error) {
      showError('Failed to sync work orders');
    } finally {
      setRefreshing(false);
    }
  };
  
  const startWork = async (workOrderId: string) => {
    try {
      const location = await getCurrentLocation();
      
      await api.post(`/contractors/work-orders/${workOrderId}/start`, {
        startTime: new Date(),
        location
      });
      
      // Start time tracking
      await timeTrackingService.startTracking(workOrderId, location);
      
      showSuccess('Work started successfully');
      syncWorkOrders();
    } catch (error) {
      showError('Failed to start work');
    }
  };
  
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={syncWorkOrders} />
      }
    >
      {workOrders.map(workOrder => (
        <WorkOrderCard
          key={workOrder.id}
          workOrder={workOrder}
          onStart={() => startWork(workOrder.id)}
        />
      ))}
    </ScrollView>
  );
};
```

### 3.2 Time Tracking with GPS

```typescript
// GPS-enabled time tracking service
class TimeTrackingService {
  private currentTimeEntry: TimeEntry | null = null;
  private locationWatcher: LocationWatcher | null = null;
  
  async startTracking(workOrderId: string, initialLocation: Location): Promise<void> {
    if (this.currentTimeEntry) {
      throw new Error('Time tracking already active');
    }
    
    // Create time entry
    this.currentTimeEntry = await api.post('/time-entries', {
      workOrderId,
      startTime: new Date(),
      location: initialLocation,
      status: 'active'
    });
    
    // Start location tracking
    this.locationWatcher = new LocationWatcher({
      accuracy: 'high',
      interval: 60000, // 1 minute
      onLocationUpdate: this.handleLocationUpdate.bind(this)
    });
    
    await this.locationWatcher.start();
    
    // Start local timer
    this.startLocalTimer();
  }
  
  async stopTracking(): Promise<TimeEntry> {
    if (!this.currentTimeEntry) {
      throw new Error('No active time tracking');
    }
    
    const endTime = new Date();
    const finalLocation = await getCurrentLocation();
    
    // Stop location tracking
    if (this.locationWatcher) {
      await this.locationWatcher.stop();
      this.locationWatcher = null;
    }
    
    // Update time entry
    const completedEntry = await api.put(`/time-entries/${this.currentTimeEntry.id}`, {
      endTime,
      location: finalLocation,
      status: 'completed',
      duration: endTime.getTime() - new Date(this.currentTimeEntry.startTime).getTime()
    });
    
    this.currentTimeEntry = null;
    return completedEntry;
  }
  
  private async handleLocationUpdate(location: Location): Promise<void> {
    if (!this.currentTimeEntry) return;
    
    try {
      await api.post(`/time-entries/${this.currentTimeEntry.id}/location`, {
        location,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Failed to update location:', error);
    }
  }
}
```

## 4. API Implementation

### 4.1 Integration API Routes

```typescript
// Integration management endpoints
app.post('/api/v1/integrations/quickbooks/connect', async (req, res) => {
  try {
    const { clientId, code, state } = req.body;
    
    // Exchange code for tokens
    const authService = new QuickBooksAuthService();
    const tokens = await authService.exchangeCodeForTokens(code, state);
    
    // Get company info
    const companyInfo = await authService.getCompanyInfo(tokens);
    
    // Store integration
    const integration = await database.integrations.create({
      clientId,
      type: 'quickbooks',
      tokens: encrypt(tokens),
      companyId: companyInfo.Id,
      companyName: companyInfo.CompanyName,
      status: 'active'
    });
    
    res.json({ 
      success: true, 
      integrationId: integration.id,
      companyName: companyInfo.CompanyName
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/v1/integrations/:integrationId/sync', async (req, res) => {
  try {
    const { integrationId } = req.params;
    const integration = await database.integrations.findById(integrationId);
    
    if (!integration) {
      return res.status(404).json({ error: 'Integration not found' });
    }
    
    const syncService = new IntegrationSyncService(integration);
    const result = await syncService.performFullSync();
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 4.2 Manager Dashboard APIs

```typescript
// Real-time dashboard endpoints
app.get('/api/v1/dashboard/contractors/active', async (req, res) => {
  const { clientId } = req.user;
  
  const contractors = await database.contractors.findActiveByClient(clientId, {
    includeLocation: true,
    includeCurrentJob: true,
    includeTimeTracking: true
  });
  
  res.json(contractors);
});

app.get('/api/v1/dashboard/invoices/pending', async (req, res) => {
  const { clientId } = req.user;
  
  const invoices = await database.invoices.findPendingApproval(clientId, {
    includeValidation: true,
    includeTimeEntries: true,
    includeContractor: true
  });
  
  res.json(invoices);
});

app.post('/api/v1/dashboard/invoices/:invoiceId/approve', async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const { notes } = req.body;
    const { userId: managerId } = req.user;
    
    const approvalService = new InvoiceApprovalService();
    await approvalService.approveInvoice(invoiceId, managerId, notes);
    
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

## 5. Deployment Strategy

### 5.1 Infrastructure Setup

```yaml
# docker-compose.yml for development
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://user:pass@db:5432/invoicepatch
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
  
  db:
    image: postgres:14
    environment:
      POSTGRES_DB: invoicepatch
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
  
  workers:
    build: .
    command: npm run workers
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://user:pass@db:5432/invoicepatch
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

volumes:
  postgres_data:
```

### 5.2 Production Deployment

```bash
# Production deployment script
#!/bin/bash

# Build and deploy to AWS ECS
docker build -t invoicepatch:latest .
docker tag invoicepatch:latest ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/invoicepatch:latest
docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/invoicepatch:latest

# Update ECS service
aws ecs update-service \
  --cluster invoicepatch-cluster \
  --service invoicepatch-service \
  --force-new-deployment

# Run database migrations
aws ecs run-task \
  --cluster invoicepatch-cluster \
  --task-definition invoicepatch-migrate \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=ENABLED}"
```

---

This Phase 1 implementation provides a solid foundation for the InvoicePatch Integration Platform, establishing core capabilities that can be demonstrated to potential enterprise clients while building toward the comprehensive B2B automation system outlined in the full specification. 