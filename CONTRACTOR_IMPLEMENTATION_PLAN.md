# Contractor Dashboard Implementation Plan

## Current State Analysis

### ✅ What's Already Working
- **API Endpoints**: Real contractor API endpoints exist and are functional
- **Database**: Supabase database with proper schema for trial invoices and daily entries
- **Authentication**: OTP-based authentication system
- **PDF Generation**: Working invoice generation with real data

### ❌ What Needs to be Replaced
- **Mockup Data**: Hardcoded project info, earnings, performance metrics
- **Placeholder Components**: WorkHistoryView, ExpensesView, PaymentsView, SettingsView
- **Static Time Tracking**: Mock location data and time entries
- **No Real State Management**: Components don't use real API data

## Implementation Strategy

### Phase 1: Foundation (Week 1) - COMPLETED ✅
- [x] Created `contractorService.ts` - Centralized API calls
- [x] Created `ContractorContext.tsx` - State management
- [x] Added ContractorProvider to layout
- [x] Defined TypeScript interfaces for all data structures

### Phase 2: Core Dashboard (Week 2)
- [ ] Update `ContractorDashboardOverview.tsx` to use real data
- [ ] Update `TimeTrackingWidget.tsx` with real GPS and time tracking
- [ ] Update `InvoiceStatusWidget.tsx` with real invoice data
- [ ] Implement proper error handling and loading states

### Phase 3: Advanced Features (Week 3)
- [ ] Implement `WorkHistoryView` with real data
- [ ] Implement `ExpensesView` with expense tracking
- [ ] Implement `PaymentsView` with payment history
- [ ] Implement `SettingsView` with account management

### Phase 4: Real-world Testing (Week 4)
- [ ] GPS location tracking
- [ ] Photo upload functionality
- [ ] Offline capability
- [ ] Performance optimization

## Detailed Implementation Steps

### Step 1: Update ContractorDashboardOverview
**File**: `src/components/contractor/ContractorDashboardOverview.tsx`

**Changes Needed**:
```typescript
// Replace mockup data with real API calls
const { dashboard, isLoading, error, loadDashboard } = useContractor();

// Replace hardcoded project info
const currentProject = dashboard?.trialInvoice || {
  name: 'Loading...',
  location: 'Loading...',
  company: 'Loading...',
  rate: 0,
  rateType: 'hourly'
};

// Replace hardcoded earnings
const payPeriod = dashboard?.summary || {
  earnings: 0,
  daysWorked: 0,
  daysRemaining: 0,
  completion: 0,
  projectedEarnings: 0,
};
```

### Step 2: Update TimeTrackingWidget
**File**: `src/components/contractor/TimeTrackingWidget.tsx`

**Changes Needed**:
```typescript
// Replace mock location with real GPS
const { startTracking, stopTracking, currentTimeEntry } = useContractor();

// Use real location service
const handleStartWork = async () => {
  try {
    const location = await getCurrentLocation();
    await startTracking({
      trialInvoiceId: dashboard.trialInvoice.id,
      startTime: new Date().toISOString(),
      location,
      equipment,
      notes
    });
  } catch (error) {
    // Handle GPS permission denied
  }
};
```

### Step 3: Implement Real Components

#### WorkHistoryView
```typescript
// src/components/contractor/WorkHistoryView.tsx
export default function WorkHistoryView() {
  const { dashboard, isLoading } = useContractor();
  
  if (isLoading) return <LoadingSpinner />;
  
  return (
    <div className="space-y-4">
      {dashboard?.entries.map(entry => (
        <WorkHistoryCard key={entry.id} entry={entry} />
      ))}
    </div>
  );
}
```

#### ExpensesView
```typescript
// src/components/contractor/ExpensesView.tsx
export default function ExpensesView() {
  const [expenses, setExpenses] = useState([]);
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  
  return (
    <div>
      <ExpenseForm onSubmit={handleAddExpense} />
      <ExpenseList expenses={expenses} />
    </div>
  );
}
```

## API Endpoints to Implement

### Missing Endpoints
1. **Photo Upload**: `/api/contractor/upload-photo`
2. **Expense Management**: `/api/contractor/expenses`
3. **Payment History**: `/api/contractor/payments`
4. **Settings Management**: `/api/contractor/settings`

### Existing Endpoints to Use
1. **Dashboard**: `/api/contractor/dashboard` ✅
2. **Daily Entries**: `/api/contractor/entries` ✅
3. **Time Tracking**: `/api/contractor/checkin` ✅
4. **Invoice Management**: `/api/contractor/invoices` ✅

## Database Schema Updates

### New Tables Needed
```sql
-- Expenses table
CREATE TABLE contractor_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trial_invoice_id UUID REFERENCES trial_invoices(id),
  date DATE NOT NULL,
  category VARCHAR(50) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  receipt_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Payment history table
CREATE TABLE contractor_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trial_invoice_id UUID REFERENCES trial_invoices(id),
  amount DECIMAL(10,2) NOT NULL,
  payment_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  method VARCHAR(20),
  reference_number VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Testing Strategy

### Unit Tests
- [ ] Test contractor service functions
- [ ] Test context state management
- [ ] Test component rendering with real data

### Integration Tests
- [ ] Test API endpoint integration
- [ ] Test GPS location services
- [ ] Test photo upload functionality

### User Acceptance Tests
- [ ] Complete contractor workflow from start to finish
- [ ] Test offline functionality
- [ ] Test mobile responsiveness

## Success Metrics

### Technical Metrics
- [ ] 100% removal of mockup data
- [ ] < 2 second API response times
- [ ] 99.9% uptime for contractor features
- [ ] Zero TypeScript errors

### User Experience Metrics
- [ ] < 3 clicks to start time tracking
- [ ] < 30 seconds to complete daily entry
- [ ] 95% user satisfaction with GPS accuracy
- [ ] < 5% error rate in data entry

## Risk Mitigation

### Technical Risks
1. **GPS Permission Issues**: Implement fallback location input
2. **Network Connectivity**: Add offline mode with sync
3. **Photo Upload Failures**: Implement retry mechanism
4. **Data Loss**: Implement auto-save and backup

### User Experience Risks
1. **Complex UI**: Maintain simple, intuitive interface
2. **Slow Performance**: Implement loading states and caching
3. **Data Entry Errors**: Add validation and confirmation dialogs

## Next Steps

1. **Immediate**: Start with Phase 2 - Update ContractorDashboardOverview
2. **This Week**: Implement real time tracking with GPS
3. **Next Week**: Complete all placeholder components
4. **Following Week**: Real-world testing and optimization

## Resources Needed

### Development
- [ ] 1 Full-stack developer (2 weeks)
- [ ] 1 Mobile/React developer (1 week)
- [ ] 1 QA tester (1 week)

### Infrastructure
- [ ] Google Maps API key for geocoding
- [ ] File storage for photo uploads
- [ ] Additional Supabase storage

### Testing
- [ ] Test devices (iOS/Android)
- [ ] GPS testing environment
- [ ] Network simulation tools 