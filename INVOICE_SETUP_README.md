# InvoicePatch Trial Setup System

A comprehensive, mobile-optimized invoice setup interface for the InvoicePatch trial automation system.

## 🚀 Features

### Core Form Fields
- **Ticket Number**: Text input for work order identification
- **Location**: Job site location (e.g., Calgary Downtown)
- **Company**: Client company name
- **Day Rate**: Daily labor rate with validation
- **Truck Rate**: Daily equipment/truck rate
- **Travel KMs**: Round trip distance calculation
- **Tax-Free Subsistence**: Daily meal allowance
- **Work Start Date**: Date picker for project commencement
- **Work Days**: Interactive weekly schedule selector
- **Invoice Frequency**: Weekly or bi-weekly billing options

### Smart Features

#### 📱 Mobile-First Design
- **Touch-Friendly Inputs**: All form elements meet 44px minimum touch target requirements
- **Responsive Layout**: Adapts seamlessly from 320px to desktop widths
- **Large Buttons**: Easy tapping with proper spacing
- **Keyboard Optimization**: Appropriate input types for mobile keyboards
- **No Horizontal Scroll**: Content always fits viewport width

#### 💡 Industry Intelligence
- **Rate Calculator**: Intelligent suggestions based on:
  - Job category (Equipment Operator, Directional Driller, etc.)
  - Equipment type (Pickup, Service Truck, Vacuum Truck, etc.)
  - Years of experience (automatic rate adjustments)
- **Real-Time Validation**: Instant feedback on rate competitiveness
- **Industry Insights**: Current market data and billing best practices

#### 💾 Auto-Save & Draft Management
- **Automatic Draft Saving**: Form data saved to localStorage every second
- **Draft Recovery**: Automatically restores unsaved work on page reload
- **Manual Save**: Explicit "Save Draft" option for user control
- **Offline Capability**: Works without internet connection

#### 📊 Live Preview
- **Real-Time Calculations**: Live preview of daily charges
- **GST Calculation**: Automatic 5% GST computation
- **Weekly Projections**: Projected weekly earnings based on work schedule
- **Visual Feedback**: Color-coded validation states

## 🛠 Technical Implementation

### File Structure
```
src/app/trial-setup/
├── page.tsx           # Main invoice setup form
├── layout.tsx         # Page layout with navigation
src/components/
└── InvoiceSetupHelpers.tsx  # Helper components and utilities
```

### Key Components

#### TrialSetupPage (Main Form)
- Comprehensive form with all required fields
- Real-time validation and error handling
- Auto-save functionality with localStorage
- Mobile-optimized layout and interactions
- Live preview calculations

#### Helper Components
- **RateCalculator**: Industry-specific rate suggestions
- **ValidationTooltip**: Contextual validation feedback
- **IndustryInsights**: Market data and best practices
- **useFormValidation**: Custom hook for form validation

### Mobile Optimizations

#### CSS Classes Used
- `touch-target`: Ensures 44px minimum touch targets
- `mobile-container`: Prevents horizontal scroll
- `mobile-spacing-*`: Responsive padding/margins
- `break-words`: Prevents text overflow

#### Input Optimizations
- `font-size: 16px` on form inputs (prevents iOS zoom)
- Appropriate `inputmode` and `type` attributes
- Large touch targets for all interactive elements
- Proper focus states for accessibility

## 📋 Form Validation

### Required Fields
- Ticket Number
- Location
- Company Name
- Day Rate (> $0)
- Truck Rate (> $0)
- Travel KMs (≥ 0)
- Tax-Free Subsistence (≥ 0)
- Work Start Date
- At least one work day selected

### Smart Validation
- **Rate Warnings**: Flags unusually high/low rates
- **Travel Alerts**: Suggests overnight allowances for long commutes
- **Industry Benchmarks**: Compares against current market rates
- **Real-Time Feedback**: Instant validation as user types

## 🎯 User Experience Features

### Progressive Disclosure
- Form sections organized logically
- Collapsible rate calculator
- Expandable industry insights
- Context-sensitive help tooltips

### Visual Feedback
- ✅ Success states for valid inputs
- ⚠️ Warning states for questionable values
- ❌ Error states for invalid inputs
- 💡 Information tooltips for guidance

### Accessibility
- Proper ARIA labels and roles
- Keyboard navigation support
- High contrast mode compatibility
- Screen reader friendly structure

## 🔧 Usage Instructions

### For Users
1. **Navigate** to `/trial-setup`
2. **Fill out** basic information (ticket, location, company)
3. **Enter rates** manually or use the Rate Calculator
4. **Set travel details** and subsistence allowances
5. **Choose work schedule** and invoice frequency
6. **Review preview** of daily charges
7. **Save draft** or **Start Trial**

### For Developers
```tsx
// Import the main component
import TrialSetupPage from '@/app/trial-setup/page';

// Use helper components
import { 
  RateCalculator, 
  ValidationTooltip, 
  IndustryInsights,
  useFormValidation 
} from '@/components/InvoiceSetupHelpers';

// Example usage
const MyForm = () => {
  const { errors, warnings, validateField } = useFormValidation(formData);
  
  return (
    <div>
      <RateCalculator onRateUpdate={handleRateUpdate} />
      <ValidationTooltip 
        field="dayRate" 
        value={formData.dayRate} 
        isValid={!errors.dayRate} 
      />
    </div>
  );
};
```

## 📱 Mobile Testing Checklist

### Breakpoints Tested
- ✅ 320px (iPhone SE)
- ✅ 375px (iPhone 12/13)
- ✅ 414px (iPhone 12 Pro Max)
- ✅ 768px (iPad Portrait)
- ✅ 1024px (iPad Landscape)

### Touch Interactions
- ✅ All buttons ≥ 44px touch targets
- ✅ Form inputs easy to tap and fill
- ✅ Dropdown selectors touch-friendly
- ✅ Checkbox/radio buttons properly sized

### Performance
- ✅ Form loads quickly on 3G connections
- ✅ Auto-save doesn't block user interactions
- ✅ Smooth animations and transitions
- ✅ Offline functionality works

## 🚀 Future Enhancements

### Planned Features
- **Photo Upload**: Attach work order documents
- **Location Services**: Auto-populate job site details
- **Contractor Profiles**: Save and reuse common settings
- **Multi-Language**: Support for French (Alberta bilingual)
- **Push Notifications**: Daily check-in reminders

### Technical Improvements
- **PWA Support**: Install as mobile app
- **Sync Capabilities**: Cloud backup of drafts
- **Advanced Validation**: Integration with industry databases
- **Analytics**: Usage tracking and optimization

## 📞 Support

For questions or issues with the invoice setup system:
- **Email**: support@invoicepatch.com
- **Documentation**: [Internal Wiki Link]
- **Bug Reports**: [GitHub Issues Link]

---

*Built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion* 