import { generateInvoicePDF, calculateTaxes } from '../pdfGenerator';

describe('pdfGenerator', () => {
  const mockInvoiceData = {
    invoiceNumber: 'INV-001',
    issueDate: new Date('2024-01-01'),
    dueDate: new Date('2024-01-31'),
    contractor: {
      name: 'Test Contractor',
      address: '123 Main St',
      email: 'contractor@test.com',
    },
    client: {
      name: 'Test Client',
      address: '456 Client Rd',
    },
    period: {
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-31'),
    },
    entries: [
      { date: new Date('2024-01-01'), description: 'Work', regularHours: 8, overtimeHours: 2, travelHours: 1, amount: 300 },
    ],
    summary: {
      regularHours: 8,
      overtimeHours: 2,
      travelHours: 1,
      totalHours: 11,
      regularAmount: 200,
      overtimeAmount: 80,
      travelAmount: 20,
      expensesTotal: 0,
      subtotal: 300,
      gst: 15,
      pst: 0,
      total: 315,
    },
    notes: 'Thank you!',
  };

  it('generates a valid PDF for invoice data', async () => {
    const { pdfBlob, pdfBase64 } = await generateInvoicePDF(mockInvoiceData);
    expect(pdfBlob).toBeInstanceOf(Blob);
    expect(typeof pdfBase64).toBe('string');
    expect(pdfBase64.length).toBeGreaterThan(100);
  });

  it('handles large datasets efficiently', async () => {
    const largeEntries = Array.from({ length: 200 }, (_, i) => ({
      date: new Date('2024-01-01'),
      description: `Work ${i + 1}`,
      regularHours: 8,
      overtimeHours: 0,
      travelHours: 0,
      amount: 100,
    }));
    const largeData = { ...mockInvoiceData, entries: largeEntries };
    const start = Date.now();
    const { pdfBlob } = await generateInvoicePDF(largeData);
    const duration = Date.now() - start;
    expect(pdfBlob.size).toBeLessThan(2 * 1024 * 1024); // <2MB
    expect(duration).toBeLessThan(3000); // <3s
  });

  it('calculates taxes correctly', () => {
    const result = calculateTaxes(1000, 'AB');
    expect(result.gst).toBeCloseTo(50);
    expect(result.pst).toBeCloseTo(0);
    expect(result.total).toBeCloseTo(1050);
  });

  it('throws on invalid data', async () => {
    await expect(generateInvoicePDF(null as any)).rejects.toThrow();
  });
}); 