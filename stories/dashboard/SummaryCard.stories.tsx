import type { Meta, StoryObj } from '@storybook/react';
import { SummaryCard } from '../../src/components/dashboard/SummaryCard';
import { CheckCircle } from 'lucide-react';
import React from 'react';

const meta: Meta<typeof SummaryCard> = {
  title: 'Dashboard/SummaryCard',
  component: SummaryCard,
};
export default meta;

type Story = StoryObj<typeof SummaryCard>;

export const Default: Story = {
  args: {
    icon: <CheckCircle className="w-6 h-6 text-green-500" />,
    label: 'Active Periods',
    value: 3,
  },
};

export const LargeValue: Story = {
  args: {
    icon: <CheckCircle className="w-6 h-6 text-blue-500" />,
    label: 'Unverified $',
    value: 12000,
  },
}; 