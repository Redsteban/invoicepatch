# Alberta Tax Calculation System - InvoicePatch

## Overview
The Alberta Tax Calculation System is a comprehensive, CRA-compliant tax calculation engine designed specifically for oilfield contractors working in Alberta. The system correctly applies 5% GST to taxable services while keeping expense reimbursements tax-free, ensuring full compliance with Alberta and federal tax regulations.

## Alberta Tax Structure

### Tax Rates
- **GST (Goods and Services Tax)**: 5% (Federal)
- **PST (Provincial Sales Tax)**: 0% (Alberta has no PST)
- **Total Tax Rate**: 5% on taxable services only

### Taxable Items (Subject to 5% GST)
- Labor services (day rates, hourly rates)
- Equipment rental services (truck rates, equipment fees) 
- Additional service charges
- Consulting fees
- Professional services

### Non-Taxable Items (Expense Reimbursements)
- Travel kilometer reimbursements (CRA standard rate: $0.68/km for 2024)
- Subsistence/meal allowances (CRA-compliant amounts)
- Legitimate business expense reimbursements
- Accommodation reimbursements
- Other approved expense categories

## System Components

### Core Library (`src/lib/albertaTax.ts`)

#### Constants
```typescript
export const ALBERTA_GST_RATE = 0.05; // 5% GST
export const ALBERTA_PST_RATE = 0.00; // 0% PST
export const STANDARD_TRAVEL_RATE_PER_KM = 0.68; // CRA 2024 rate
```

#### Main Interfaces
```typescript
interface AlbertaInvoiceCalculation {
  // Input amounts
  dayRateTotal: number;
  truckRateTotal: number;
  additionalCharges: number;
  travelReimbursement: number;
  subsistence: number;
  
  // Calculated amounts
  taxableSubtotal: number;    // Sum of taxable services
  gstAmount: number;          // taxableSubtotal × 0.05
  afterTaxSubtotal: number;   // taxableSubtotal + gstAmount
  nonTaxableTotal: number;    // travel + subsistence
  grandTotal: number;         // afterTaxSubtotal + nonTaxableTotal
}
```

#### Core Functions

**`calculateAlbertaTax(input: InvoiceInput): AlbertaInvoiceCalculation`**
- Main calculation function
- Applies 5% GST to taxable services
- Excludes reimbursements from tax
- Rounds GST to 2 decimal places for accuracy

**`calculateDailyAlbertaTax(dailyData: DailyWorkData): AlbertaInvoiceCalculation`**
- Calculates tax for single day's work
- Handles conditional rates (day rate used/not used, truck used/not used)
- Includes additional charges if applicable

**`calculateWeeklyAlbertaTax(weeklyData: WeeklyWorkData): AlbertaInvoiceCalculation`**
- Aggregates multiple daily calculations
- Handles weekly totals with proper rounding
- Maintains tax compliance across multi-day periods

**`validateTaxCalculation(calculation: AlbertaInvoiceCalculation)`**
- Validates calculation accuracy
- Checks for negative values
- Verifies GST calculation correctness
- Returns errors and warnings for review

**`formatCAD(amount: number): string`**
- Formats currency in Canadian dollar format
- Consistent formatting across all displays
- Proper decimal handling

### Reusable Component (`src/components/TaxCalculationDisplay.tsx`)

#### Features
- Professional tax breakdown display
- Real-time calculation updates
- Validation error/warning display
- Alberta tax information panel
- Mobile-responsive design
- Customizable title and subtitle

#### Props
```typescript
interface TaxCalculationDisplayProps {
  calculation: AlbertaInvoiceCalculation;
  title?: string;
  subtitle?: string;
  showValidation?: boolean;
  showTaxInfo?: boolean;
  className?: string;
}
```

#### Usage Example
```tsx
<TaxCalculationDisplay
  calculation={taxCalculation}
  title="Daily Invoice Calculation"
  subtitle="Alberta GST calculation"
  showValidation={true}
  showTaxInfo={true}
/>
```

### Demo Page (`src/app/alberta-tax-demo/page.tsx`)

#### Features
- Interactive tax calculator
- Simple and detailed calculation modes
- Example scenarios for different contractor types
- Real-time calculation updates
- Educational tax information
- Mobile-optimized interface

#### Example Scenarios
1. **Drilling Supervisor**: $850 day rate, company truck, 45km commute
2. **Service Tech + Equipment**: $650 day rate, $300 truck rate, 80km travel
3. **Consultant**: $1200 day rate, minimal travel, no meals
4. **Equipment Operator**: $500 day rate, $450 truck rate, long distance

## Integration Points

### Invoice Setup System
**Location**: `src/app/invoice-setup/page.tsx`

**Integration**:
- Real-time preview using `calculateTrialPreview()`
- Formatted currency display with `formatCAD()`
- Live updates as user enters data
- Professional tax breakdown in sidebar

```typescript
const preview = calculateTrialPreview({
  dayRate: formData.dayRate,
  truckRate: formData.truckRate,
  travelKms: formData.travelKms,
  subsistence: formData.subsistence
});
```

### API Integration
**Location**: `src/app/api/setup-trial-invoice/route.ts`

**Integration**:
- Server-side tax calculation for trial setup
- Database storage of calculated daily totals
- Consistent calculation between frontend and backend

```typescript
const calculation = calculateTrialPreview({
  dayRate: data.dayRate,
  truckRate: data.truckRate,
  travelKms: data.travelKms,
  subsistence: data.subsistence
});

// Store calculated values in database
daily_taxable_amount: calculation.taxableSubtotal,
daily_gst: calculation.gstAmount,
daily_total: calculation.grandTotal
```

### Daily Check-in System
**Location**: `src/app/daily-checkin/page.tsx`

**Integration**:
- Real-time calculation during work entry
- Instant tax breakdown display
- Validation of entered amounts
- CRA-compliant reimbursement calculations

### Manager Components
**Integration Points**:
- `src/components/manager/InvoiceCalculator.tsx`
- `src/components/manager/ApprovalWorkflow.tsx`
- Manager reconciliation workflows

## Calculation Examples

### Example 1: Standard Day Work
```
Day Rate: $750.00
Truck Rate: $200.00
Travel: 50km @ $0.68/km = $34.00
Subsistence: $75.00

Calculation:
- Taxable Subtotal: $750 + $200 = $950.00
- GST (5%): $950 × 0.05 = $47.50
- After Tax: $950 + $47.50 = $997.50
- Non-Taxable: $34 + $75 = $109.00
- TOTAL: $997.50 + $109.00 = $1,106.50
```

### Example 2: Equipment Only
```
Day Rate: $0.00 (not working)
Truck Rate: $400.00
Travel: 0km = $0.00
Subsistence: $0.00

Calculation:
- Taxable Subtotal: $0 + $400 = $400.00
- GST (5%): $400 × 0.05 = $20.00
- After Tax: $400 + $20 = $420.00
- Non-Taxable: $0 + $0 = $0.00
- TOTAL: $420.00 + $0.00 = $420.00
```

### Example 3: High Travel Day
```
Day Rate: $800.00
Truck Rate: $0.00
Travel: 150km @ $0.68/km = $102.00
Subsistence: $100.00

Calculation:
- Taxable Subtotal: $800 + $0 = $800.00
- GST (5%): $800 × 0.05 = $40.00
- After Tax: $800 + $40 = $840.00
- Non-Taxable: $102 + $100 = $202.00
- TOTAL: $840.00 + $202.00 = $1,042.00
```

## CRA Compliance Features

### Travel Reimbursements
- Uses current CRA standard rate ($0.68/km for 2024)
- Automatically calculated as non-taxable
- Proper documentation in invoice breakdown
- Audit-ready calculations

### Subsistence Allowances
- Treated as tax-free expense reimbursement
- Compliant with CRA guidelines
- Proper categorization in tax breakdown
- Clear separation from taxable income

### GST Handling
- Precise 5% calculation on taxable services only
- Proper rounding to avoid floating-point errors
- Clear GST breakdown for reporting
- Compliance with Alberta tax requirements

## Validation and Error Handling

### Calculation Validation
- Verifies GST calculation accuracy
- Checks for negative values
- Validates total calculations
- Provides detailed error messages

### Common Validations
```typescript
// Check for negative values
if (value < 0) errors.push("Values cannot be negative");

// Verify GST calculation
const expectedGST = Math.round(taxableSubtotal * 0.05 * 100) / 100;
if (Math.abs(calculatedGST - expectedGST) > 0.01) {
  errors.push("GST calculation incorrect");
}

// Validate totals
const expectedTotal = afterTax + nonTaxable;
if (Math.abs(grandTotal - expectedTotal) > 0.01) {
  errors.push("Total calculation incorrect");
}
```

### Warning System
- Unusual GST amounts
- Zero taxable services
- High reimbursement ratios
- Potential calculation issues

## Annual Tax Planning

### GST Estimation
```typescript
function calculateAnnualGSTEstimate(monthlyAverage: AlbertaInvoiceCalculation) {
  const annualTaxableIncome = monthlyAverage.taxableSubtotal * 12;
  const annualGSTPayable = annualTaxableIncome * ALBERTA_GST_RATE;
  const quarterlyGSTPayment = annualGSTPayable / 4;
  const monthlyGSTReserve = annualGSTPayable / 12;
  
  return {
    annualTaxableIncome,
    annualGSTPayable,
    quarterlyGSTPayment,
    monthlyGSTReserve
  };
}
```

### Planning Features
- Annual taxable income projection
- Quarterly GST payment estimates
- Monthly GST reserve calculations
- Tax planning insights

## Performance Optimizations

### Calculation Efficiency
- Minimal floating-point operations
- Proper rounding strategies
- Efficient number handling
- Cached calculation results

### Memory Management
- Lightweight calculation objects
- Efficient data structures
- Minimal memory allocation
- Optimized for mobile devices

## Testing Strategy

### Unit Tests
- Individual calculation functions
- Edge case handling
- Rounding accuracy
- Validation logic

### Integration Tests
- Component integration
- API endpoint testing
- Database storage verification
- End-to-end workflows

### Example Test Cases
```typescript
describe('Alberta Tax Calculations', () => {
  it('should calculate GST correctly', () => {
    const result = calculateAlbertaTax({
      dayRateTotal: 1000,
      truckRateTotal: 200,
      additionalCharges: 0,
      travelReimbursement: 34,
      subsistence: 75
    });
    
    expect(result.taxableSubtotal).toBe(1200);
    expect(result.gstAmount).toBe(60);
    expect(result.grandTotal).toBe(1369);
  });
});
```

## Mobile Responsiveness

### Responsive Design
- Touch-friendly calculation inputs
- Mobile-optimized tax displays
- Responsive layout grids
- Proper font scaling

### Mobile-Specific Features
- Touch target optimization (44px minimum)
- Swipe-friendly interfaces
- Optimized input types
- Mobile keyboard support

## Future Enhancements

### Planned Features
1. **Multi-Province Support**: Extend to other Canadian provinces
2. **HST Calculations**: Support for HST provinces
3. **Advanced Scenarios**: Complex tax situations
4. **Tax Report Generation**: Automated tax reporting
5. **CRA Integration**: Direct filing capabilities

### Scalability Considerations
- Modular calculation engine
- Pluggable tax rate providers
- Configurable validation rules
- Extensible component system

## Deployment and Monitoring

### Build Integration
- TypeScript compilation
- Next.js static generation
- Production optimization
- Error monitoring

### Performance Monitoring
- Calculation speed tracking
- Memory usage monitoring
- Error rate tracking
- User experience metrics

## Documentation and Support

### Developer Documentation
- Comprehensive API documentation
- Usage examples
- Integration guides
- Best practices

### User Support
- Tax calculation explanations
- CRA compliance guidance
- Common scenarios
- Troubleshooting guides

## Summary

The Alberta Tax Calculation System provides a robust, CRA-compliant foundation for oilfield invoice calculations. With proper separation of taxable services and expense reimbursements, accurate GST calculations, and comprehensive validation, the system ensures contractors can generate professional, compliant invoices while maintaining tax accuracy.

The system integrates seamlessly with the InvoicePatch trial workflow, providing real-time calculations, professional displays, and comprehensive tax breakdowns that help contractors understand their tax obligations and maximize their legitimate expense reimbursements. 