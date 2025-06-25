import type { Meta, StoryObj } from '@storybook/react';
import { TemplateForm } from '../src/components/TemplateForm';
import { TemplateProvider } from '../src/context/TemplateProvider';
import React from 'react';

const meta: Meta<typeof TemplateForm> = {
  title: 'Forms/TemplateForm',
  component: TemplateForm,
  decorators: [
    (Story) => (
      <TemplateProvider>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Story />
        </div>
      </TemplateProvider>
    ),
  ],
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};
export default meta;

type Story = StoryObj<typeof TemplateForm>;

export const Empty: Story = {
  args: {
    initialValues: undefined,
    onClose: () => {},
  },
};

export const PrefilledDayRate1035: Story = {
  args: {
    initialValues: {
      name: 'Day Rate Template',
      rate: 1035,
      hours: 8,
      unit: 'day',
      ot_multiplier: 1.5,
      description: 'Prefilled for day rate',
    },
    onClose: () => {},
  },
};

export const Invalid: Story = {
  render: (args) => {
    // Simulate invalid state by submitting with invalid values
    const [show, setShow] = React.useState(true);
    React.useEffect(() => {
      if (show) {
        setTimeout(() => {
          const form = document.querySelector('form');
          if (form) form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        }, 500);
      }
    }, [show]);
    return <TemplateForm {...args} initialValues={{ name: '', rate: -1, hours: 30, unit: 'hour' }} onClose={() => {}} />;
  },
}; 