import { sendInvoiceEmail, sendWelcomeEmail, validateEmailAddress, createEmailTemplate } from '../emailService';
import nodemailer from 'nodemailer';

jest.mock('nodemailer');
const sendMailMock = jest.fn();
(nodemailer.createTransport as jest.Mock).mockReturnValue({ sendMail: sendMailMock });

describe('emailService', () => {
  beforeEach(() => {
    sendMailMock.mockReset();
  });

  it('validates email addresses', () => {
    expect(validateEmailAddress('user@test.com')).toBe(true);
    expect(validateEmailAddress('bademail')).toBe(false);
  });

  it('sends invoice email and confirms delivery', async () => {
    sendMailMock.mockResolvedValue({ messageId: '123' });
    const result = await sendInvoiceEmail('user@test.com', { invoiceNumber: 'INV-001', issueDate: new Date(), dueDate: new Date(), contractor: { name: '', address: '', email: '' }, client: { name: '', address: '' }, period: { startDate: new Date(), endDate: new Date() }, entries: [], summary: { regularHours: 0, overtimeHours: 0, travelHours: 0, totalHours: 0, regularAmount: 0, overtimeAmount: 0, travelAmount: 0, expensesTotal: 0, subtotal: 0, gst: 0, pst: 0, total: 0 } }, 'PDFDATA');
    expect(result.success).toBe(true);
    expect(result.info.messageId).toBe('123');
  });

  it('handles SMTP errors gracefully', async () => {
    sendMailMock.mockRejectedValue(new Error('SMTP error'));
    const result = await sendInvoiceEmail('user@test.com', { invoiceNumber: 'INV-001', issueDate: new Date(), dueDate: new Date(), contractor: { name: '', address: '', email: '' }, client: { name: '', address: '' }, period: { startDate: new Date(), endDate: new Date() }, entries: [], summary: { regularHours: 0, overtimeHours: 0, travelHours: 0, totalHours: 0, regularAmount: 0, overtimeAmount: 0, travelAmount: 0, expensesTotal: 0, subtotal: 0, gst: 0, pst: 0, total: 0 } }, 'PDFDATA');
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/Failed to send email/);
  });

  it('sends welcome email', async () => {
    sendMailMock.mockResolvedValue({ messageId: 'abc' });
    const result = await sendWelcomeEmail('user@test.com', 'Test');
    expect(result.success).toBe(true);
    expect(result.info.messageId).toBe('abc');
  });

  it('creates email templates', () => {
    const html = createEmailTemplate('invoice', { invoiceNumber: 'INV-001', issueDate: new Date(), dueDate: new Date(), contractor: { name: '', address: '', email: '' }, client: { name: '', address: '' }, period: { startDate: new Date(), endDate: new Date() }, entries: [], summary: { regularHours: 0, overtimeHours: 0, travelHours: 0, totalHours: 0, regularAmount: 0, overtimeAmount: 0, travelAmount: 0, expensesTotal: 0, subtotal: 0, gst: 0, pst: 0, total: 0 } });
    expect(typeof html).toBe('string');
    expect(html).toMatch(/Invoice/);
  });
}); 