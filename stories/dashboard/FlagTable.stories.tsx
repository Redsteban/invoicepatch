import type { Meta, StoryObj } from '@storybook/react';
import { FlagTable, Flag } from '../../src/components/dashboard/FlagTable';
import React, { useState } from 'react';

const meta: Meta<typeof FlagTable> = {
  title: 'Dashboard/FlagTable',
  component: FlagTable,
};
export default meta;

type Story = StoryObj<typeof FlagTable>;

const mockFlags: Flag[] = [
  {
    id: '1',
    pay_period_id: 'pp1',
    entry_id: 'e1',
    type: 'Flag',
    message: 'Missing signature',
    date: '2024-07-01',
  },
  {
    id: '2',
    pay_period_id: 'pp2',
    entry_id: 'e2',
    type: 'Warning',
    message: 'Overtime exceeded',
    date: '2024-07-02',
  },
  // ...add more for multiple pages
];

export const Empty: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    return <FlagTable flags={[]} page={page} pageSize={5} onPageChange={setPage} />;
  },
};

export const SinglePage: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    return <FlagTable flags={mockFlags.slice(0, 2)} page={page} pageSize={5} onPageChange={setPage} />;
  },
};

export const MultiplePages: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    const manyFlags = Array.from({ length: 12 }, (_, i) => ({
      id: String(i + 1),
      pay_period_id: 'pp' + ((i % 3) + 1),
      entry_id: 'e' + (i + 1),
      type: i % 2 === 0 ? 'Flag' : 'Warning',
      message: `Flag message ${i + 1}`,
      date: `2024-07-${(i % 30) + 1}`,
    }));
    return <FlagTable flags={manyFlags} page={page} pageSize={5} onPageChange={setPage} />;
  },
}; 