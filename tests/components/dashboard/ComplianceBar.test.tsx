import { render, screen } from '@testing-library/react';
import { ComplianceBar } from '../../../src/components/dashboard/ComplianceBar';
import React from 'react';

describe('ComplianceBar', () => {
  it('renders correct bar widths and labels', () => {
    render(<ComplianceBar verified={70} flagged={30} />);
    expect(screen.getByText('Verified: 70')).toBeInTheDocument();
    expect(screen.getByText('Flagged: 30')).toBeInTheDocument();
  });
}); 