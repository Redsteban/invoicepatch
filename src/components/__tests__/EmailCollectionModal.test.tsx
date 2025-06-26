import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EmailCollectionModal, { EmailCollectionModalProps } from '../EmailCollectionModal';

const mockInvoiceData = {
  contractorName: 'Test Contractor',
  contractorAddress: '123 Main St',
  contractorCity: 'Testville',
  contractorProvince: 'AB',
  contractorPostal: 'T1A 1A1',
  contractorPhone: '555-1234',
  contractorEmail: 'contractor@test.com',
  clientName: 'Test Client',
  clientAddress: '456 Client Rd',
  clientCity: 'Clienttown',
  clientProvince: 'BC',
  clientPostal: 'V2B 2B2',
  clientEmail: 'client@test.com',
  invoiceNumber: 'INV-001',
  invoiceDate: '2024-01-01',
  dueDate: '2024-01-31',
  lineItems: [{ description: 'Work', quantity: 1, rate: 100, amount: 100 }],
};

describe('EmailCollectionModal', () => {
  const defaultProps: EmailCollectionModalProps = {
    isOpen: true,
    onClose: jest.fn(),
    invoiceData: mockInvoiceData,
    onEmailSubmit: jest.fn(() => Promise.resolve()),
    onDownloadPDF: jest.fn(() => Promise.resolve()),
    isGenerating: false,
    isSending: false,
  };

  it('renders modal and invoice preview', () => {
    render(<EmailCollectionModal {...defaultProps} />);
    expect(screen.getByText('Get your professional invoice')).toBeInTheDocument();
    expect(screen.getByText(/INV-001/)).toBeInTheDocument();
  });

  it('validates email and consent', async () => {
    render(<EmailCollectionModal {...defaultProps} />);
    const emailInput = screen.getByPlaceholderText(/you@email.com/i);
    const submitBtn = screen.getByText(/Email PDF/i);
    // Try submitting with no email
    fireEvent.click(submitBtn);
    expect(await screen.findByText(/Email is required/)).toBeInTheDocument();
    // Enter invalid email
    fireEvent.change(emailInput, { target: { value: 'bademail' } });
    fireEvent.click(submitBtn);
    expect(await screen.findByText(/valid email address/)).toBeInTheDocument();
    // Enter valid email but no consent
    fireEvent.change(emailInput, { target: { value: 'user@test.com' } });
    fireEvent.click(submitBtn);
    expect(await screen.findByText(/Consent is required/)).toBeInTheDocument();
    // Check consent and submit
    const consent = screen.getByLabelText(/I agree to receive updates/);
    fireEvent.click(consent);
    fireEvent.click(submitBtn);
    await waitFor(() => expect(defaultProps.onEmailSubmit).toHaveBeenCalled());
  });

  it('handles loading and error states', async () => {
    const errorProps = {
      ...defaultProps,
      onEmailSubmit: jest.fn(() => Promise.reject(new Error('Send error'))),
    };
    render(<EmailCollectionModal {...errorProps} />);
    const emailInput = screen.getByPlaceholderText(/you@email.com/i);
    const consent = screen.getByLabelText(/I agree to receive updates/);
    fireEvent.change(emailInput, { target: { value: 'user@test.com' } });
    fireEvent.click(consent);
    fireEvent.click(screen.getByText(/Email PDF/i));
    expect(await screen.findByText(/Failed to send invoice/)).toBeInTheDocument();
  });

  it('calls onDownloadPDF when download button is clicked', async () => {
    render(<EmailCollectionModal {...defaultProps} />);
    const downloadBtn = screen.getByText(/Download PDF/i);
    fireEvent.click(downloadBtn);
    await waitFor(() => expect(defaultProps.onDownloadPDF).toHaveBeenCalled());
  });

  it('closes modal on close button', () => {
    render(<EmailCollectionModal {...defaultProps} />);
    fireEvent.click(screen.getByLabelText(/Close modal/i));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('is accessible with ARIA labels', () => {
    render(<EmailCollectionModal {...defaultProps} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText(/Email address/)).toBeInTheDocument();
  });
}); 