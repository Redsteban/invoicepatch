import type { Meta, StoryObj } from '@storybook/react';
import { AuditDrawer } from '../../src/components/AuditDrawer';
import React, { useState } from 'react';

const meta: Meta<typeof AuditDrawer> = {
  title: 'Components/AuditDrawer',
  component: AuditDrawer,
};
export default meta;

type Story = StoryObj<typeof AuditDrawer>;

export const Pending: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return open ? <AuditDrawer changeId="pending-id" onClose={() => setOpen(false)} /> : null;
  },
};

export const Approved: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return open ? <AuditDrawer changeId="approved-id" onClose={() => setOpen(false)} /> : null;
  },
}; 