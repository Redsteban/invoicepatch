import { render, screen } from '@testing-library/react';
import { SummaryCard } from '../../../src/components/dashboard/SummaryCard';
import { CheckCircle } from 'lucide-react';
import React from 'react';

describe('SummaryCard', () => {
  it('renders icon, label, and value', () => {
    render(<SummaryCard icon={<CheckCircle data-testid="icon" />} label="Test Label" value={42} />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
}); 