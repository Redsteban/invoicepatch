import type { Meta, StoryObj } from '@storybook/react';
import { ComplianceBar } from '../../src/components/dashboard/ComplianceBar';
import React from 'react';

const meta: Meta<typeof ComplianceBar> = {
  title: 'Dashboard/ComplianceBar',
  component: ComplianceBar,
};
export default meta;

type Story = StoryObj<typeof ComplianceBar>;

export const AllVerified: Story = {
  args: {
    verified: 100,
    flagged: 0,
  },
};

export const AllFlagged: Story = {
  args: {
    verified: 0,
    flagged: 100,
  },
};

export const Mixed: Story = {
  args: {
    verified: 70,
    flagged: 30,
  },
}; 