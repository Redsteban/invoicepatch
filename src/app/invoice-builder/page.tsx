import InvoiceBuilder from '@/components/InvoiceBuilder';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Invoice Builder - InvoicePatch',
  description: 'Create professional invoices with Canadian tax calculations. CRA compliant invoice generator for contractors and freelancers.',
  keywords: 'invoice builder, Canadian invoices, GST HST calculator, contractor billing, freelancer invoices',
};

export default function InvoiceBuilderPage() {
  return <InvoiceBuilder />;
} 