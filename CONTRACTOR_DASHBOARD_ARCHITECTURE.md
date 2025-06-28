# Contractor Dashboard Architecture

## Overview

The Contractor Dashboard is a comprehensive web application built with Next.js 14, TypeScript, and Tailwind CSS. It provides contractors with tools for time tracking, invoice management, work history, and automated billing calculations.

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Authentication**: Custom OTP-based system
- **Database**: Supabase (PostgreSQL)
- **PDF Generation**: jsPDF with html2canvas
- **Icons**: Lucide React
- **Deployment**: Vercel

## Project Structure

```
src/
├── app/
│   ├── contractor/                    # Contractor app routes
│   │   ├── dashboard/                 # Main dashboard page
│   │   ├── layout.tsx                 # Contractor layout wrapper
│   │   └── page.tsx                   # Contractor landing
│   └── api/
│       └── contractor/                # Contractor API endpoints
│           ├── dashboard/             # Dashboard data
│           ├── entries/               # Daily work entries
│           ├── invoices/              # Invoice management
│           ├── checkin/               # Time tracking
│           └── setup/                 # Onboarding
├── components/
│   └── contractor/                    # Contractor-specific components
│       ├── dashboard/                 # Dashboard widgets
│       ├── invoice/                   # Invoice components
│       └── [component files]
├── contexts/
│   ├── ContractorContext.tsx          # Contractor state management
│   ├── AuthContext.tsx                # Authentication context
│   └── RoleContext.tsx                # Role-based access control
├── lib/
│   ├── contractorService.ts           # API service layer
│   └── [utility files]
└── types/
    └── supabase.ts                    # Database type definitions
```

## Core Components Architecture

### 1. Layout & Navigation

#### ContractorLayout (`src/app/contractor/layout.tsx`)
- Wraps all contractor pages with sidebar navigation
- Provides consistent layout structure

#### ContractorSidebar (`src/components/contractor/ContractorSidebar.tsx`)
- **Features**: Responsive navigation with mobile support
- **Sections**: Main nav, Tools, Account
- **Navigation Items**:
  - Dashboard, Time Tracking, Invoices, Work History, Expenses
  - Ticket Info, Photo Upload, GPS Check-in, Equipment Log, Quick Submit
  - Payments, Notifications, Settings

### 2. Main Dashboard Page (`src/app/contractor/dashboard/page.tsx`)

#### Tab-Based Interface
- **Overview**: Dashboard summary and analytics
- **Time Tracking**: Work timer and GPS tracking
- **Ticket Info**: Daily rates and expense entry
- **Invoices**: Current and past invoice management
- **History**: Work history and time entries
- **Expenses**: Expense tracking and management
- **Payments**: Payment history and status
- **Settings**: Account configuration

#### Quick Actions
- Fill Ticket button
- Start Work Timer button
- View Invoice button
- Demo simulation link

### 3. Core Dashboard Components

#### ContractorDashboardOverview (`src/components/contractor/ContractorDashboardOverview.tsx`)
- **Purpose**: Main dashboard summary view
- **Features**:
  - Earnings summary cards
  - Work progress visualization
  - Recent activity feed
  - Quick action buttons
  - Performance metrics

#### TimeTrackingWidget (`src/components/contractor/TimeTrackingWidget.tsx`)
- **Purpose**: Real-time work tracking
- **Features**:
  - Start/stop timer functionality
  - GPS location tracking
  - Photo capture integration
  - Break management
  - Real-time duration display

#### InvoiceStatusWidget (`src/components/contractor/InvoiceStatusWidget.tsx`)
- **Purpose**: Invoice management and status tracking
- **Features**:
  - Current invoice preview
  - Submission status
  - Payment tracking
  - Invoice history
  - PDF generation

#### TicketInformationForm (`src/components/contractor/TicketInformationForm.tsx`)
- **Purpose**: Daily work entry and expense tracking
- **Features**:
  - Daily rate configuration
  - Equipment charges
  - Travel mileage tracking
  - Other expenses
  - Notes and documentation

### 4. Advanced Components

#### AutoInvoiceDashboard (`src/components/contractor/AutoInvoiceDashboard.tsx`)
- **Purpose**: Automated invoice generation and management
- **Features**:
  - Real-time invoice calculation
  - Tax computation (GST)
  - Subsistence calculations
  - Professional PDF generation
  - Email integration

#### IntelligentTimeTracking (`src/components/contractor/IntelligentTimeTracking.tsx`)
- **Purpose**: Smart time tracking with automation
- **Features**:
  - Automatic location detection
  - Break time detection
  - Overtime calculation
  - Efficiency analytics
  - GPS route tracking

#### NotificationCenter (`src/components/contractor/NotificationCenter.tsx`)
- **Purpose**: Real-time notifications and alerts
- **Features**:
  - Work reminders
  - Invoice notifications
  - Payment alerts
  - System updates
  - Push notifications

### 5. Invoice Components (`src/components/contractor/invoice/`)

#### ClientProjectSelection (`src/components/contractor/invoice/ClientProjectSelection.tsx`)
- **Purpose**: Client and project management
- **Features**:
  - Client selection
  - Project assignment
  - Rate configuration
  - Contract details

#### InvoicePreview (`src/components/contractor/invoice/InvoicePreview.tsx`)
- **Purpose**: Real-time invoice preview
- **Features**:
  - Live calculation updates
  - Professional formatting
  - Tax breakdown
  - Summary sections

#### TaxCalculation (`src/components/contractor/invoice/TaxCalculation.tsx`)
- **Purpose**: Automated tax calculations
- **Features**:
  - GST computation (5%)
  - Tax-free subsistence
  - Provincial tax support
  - Tax summary

## State Management Architecture

### ContractorContext (`src/contexts/ContractorContext.tsx`)

#### State Structure
```typescript
interface ContractorContextType {
  // State
  dashboard: ContractorDashboard | null;
  currentTimeEntry: TimeEntry | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadDashboard: (trialInvoiceId: string) => Promise<void>;
  createEntry: (entry: Omit<DailyEntry, 'id'>) => Promise<void>;
  updateEntry: (id: string, entry: Partial<DailyEntry>) => Promise<void>;
  startTracking: (data: TimeTrackingData) => Promise<void>;
  stopTracking: (entryId: string, endTime: string) => Promise<void>;
  uploadPhotoFile: (file: File) => Promise<string>;
  
  // Utility
  refreshData: () => Promise<void>;
  clearError: () => void;
}
```

#### Key Features
- Centralized state management for all contractor data
- Real-time updates across components
- Error handling and loading states
- Optimistic updates for better UX

### Data Models

#### ContractorDashboard
```typescript
interface ContractorDashboard {
  trialInvoice: {
    id: string;
    startDate: string;
    endDate: string;
    ratePerKm: number;
    dayRate: number;
    truckRate: number;
    subsistenceRate: number;
  };
  entries: DailyEntry[];
  summary: {
    totalEarned: number;
    daysWorked: number;
    daysRemaining: number;
    completionRate: number;
    projectedTotal: number;
    avgDailyEarnings: number;
    efficiencyScore: number;
  };
  payPeriods: PayPeriod[];
  analytics: {
    weeklyEarnings: number[];
    bestDay: { date: string; earnings: number };
    totalHours: number;
    avgHoursPerDay: number;
  };
}
```

#### DailyEntry
```typescript
interface DailyEntry {
  id: string;
  entryDate: string;
  worked: boolean;
  dayRateUsed?: number;
  truckRateUsed?: number;
  travelKmsActual?: number;
  subsistenceActual?: number;
  notes?: string;
  location?: string;
  photos?: string[];
  startTime?: string;
  endTime?: string;
}
```

## Service Layer Architecture

### ContractorService (`src/lib/contractorService.ts`)

#### API Functions
- `getContractorDashboard(trialInvoiceId)`: Fetch dashboard data
- `createDailyEntry(entry)`: Create new work entry
- `updateDailyEntry(id, entry)`: Update existing entry
- `startTimeTracking(data)`: Begin time tracking session
- `endTimeTracking(entryId, endTime)`: End time tracking session
- `uploadPhoto(file)`: Upload work photos

#### Utility Functions
- `formatCurrency(amount)`: Currency formatting
- `formatDuration(start, end)`: Time duration formatting
- `getCurrentLocation()`: GPS location retrieval

## API Endpoints Architecture

### Contractor API Routes (`src/app/api/contractor/`)

#### Dashboard Endpoints
- `GET /api/contractor/dashboard`: Fetch dashboard data
- `GET /api/contractor/dashboard/[id]`: Get specific dashboard

#### Entry Management
- `GET /api/contractor/entries`: List all entries
- `POST /api/contractor/entries`: Create new entry
- `PUT /api/contractor/entries/[id]`: Update entry
- `DELETE /api/contractor/entries/[id]`: Delete entry

#### Time Tracking
- `POST /api/contractor/checkin`: Start time tracking
- `PUT /api/contractor/checkin/[id]`: End time tracking
- `GET /api/contractor/checkin/[id]`: Get tracking status

#### Invoice Management
- `GET /api/contractor/invoices`: List invoices
- `POST /api/contractor/invoices`: Create invoice
- `GET /api/contractor/invoices/[id]`: Get invoice details
- `POST /api/contractor/invoices/[id]/submit`: Submit invoice

#### Authentication
- `POST /api/contractor/request-otp`: Request OTP
- `POST /api/contractor/verify-otp`: Verify OTP
- `POST /api/contractor/setup`: Initial setup

## PDF Generation Architecture

### PDF Generators (`src/utils/`)

#### HTML to PDF Generator (`htmlToPdfGenerator.ts`)
- **Purpose**: Convert HTML preview to PDF
- **Features**:
  - Exact HTML reproduction
  - Professional formatting
  - Multi-page support
  - High-quality output

#### Exact Match PDF Generator (`exactMatchPdfGenerator.ts`)
- **Purpose**: Generate PDF matching preview exactly
- **Features**:
  - Table-based layout
  - Consistent styling
  - All data inclusion
  - Professional appearance

#### Professional PDF Generator (`professionalPdfGenerator.ts`)
- **Purpose**: High-quality professional invoices
- **Features**:
  - Advanced formatting
  - Company branding
  - Multiple templates
  - Enhanced styling

## Security & Authentication

### OTP-Based Authentication
- Secure one-time password system
- Session management
- Role-based access control
- Protected routes

### Data Validation
- Input sanitization
- Type checking
- API validation
- Error handling

## Performance Optimizations

### Code Splitting
- Dynamic imports for heavy components
- Lazy loading of PDF generators
- Route-based code splitting

### State Management
- Optimistic updates
- Efficient re-renders
- Context optimization
- Memory management

### Caching Strategy
- API response caching
- PDF generation caching
- Static asset optimization
- CDN integration

## Responsive Design

### Mobile-First Approach
- Touch-friendly interfaces
- Mobile-optimized navigation
- Responsive data tables
- Adaptive layouts

### Breakpoint Strategy
- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

## Testing Strategy

### Component Testing
- Unit tests for utilities
- Component integration tests
- User interaction testing
- Accessibility testing

### API Testing
- Endpoint validation
- Error handling tests
- Performance testing
- Security testing

## Deployment Architecture

### Vercel Deployment
- Automatic builds on push
- Environment variable management
- Edge function support
- Global CDN

### Database Integration
- Supabase connection
- Real-time subscriptions
- Backup strategies
- Migration management

## Future Enhancements

### Planned Features
- Real-time collaboration
- Advanced analytics
- Mobile app integration
- API rate limiting
- Enhanced security
- Multi-language support
- Advanced reporting
- Integration APIs

### Scalability Considerations
- Microservices architecture
- Database optimization
- Caching strategies
- Load balancing
- Monitoring and logging

## Development Guidelines

### Code Standards
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Git hooks
- Code review process

### Component Guidelines
- Functional components
- Custom hooks for logic
- Props validation
- Error boundaries
- Loading states

### API Guidelines
- RESTful design
- Consistent error responses
- Rate limiting
- Authentication headers
- Request validation

This architecture provides a solid foundation for a scalable, maintainable contractor dashboard application with clear separation of concerns, robust state management, and comprehensive feature set. 