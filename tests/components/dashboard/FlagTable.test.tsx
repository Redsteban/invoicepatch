import { render, screen, fireEvent } from '@testing-library/react';
import { FlagTable, Flag } from '../../../src/components/dashboard/FlagTable';
import React from 'react';
jest.mock('next/link', () => ({ children, href }: any) => <a href={href}>{children}</a>);

describe('FlagTable', () => {
  const flags: Flag[] = [
    { id: '1', pay_period_id: 'pp1', entry_id: 'e1', type: 'Flag', message: 'Test 1', date: '2024-07-01' },
    { id: '2', pay_period_id: 'pp2', entry_id: 'e2', type: 'Warning', message: 'Test 2', date: '2024-07-02' },
    { id: '3', pay_period_id: 'pp3', entry_id: 'e3', type: 'Flag', message: 'Test 3', date: '2024-07-03' },
  ];
  it('renders flags and paginates', () => {
    const onPageChange = jest.fn();
    render(<FlagTable flags={flags} page={1} pageSize={2} onPageChange={onPageChange} />);
    expect(screen.getByText('Test 1')).toBeInTheDocument();
    expect(screen.getByText('Test 2')).toBeInTheDocument();
    expect(screen.queryByText('Test 3')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Next'));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });
}); 