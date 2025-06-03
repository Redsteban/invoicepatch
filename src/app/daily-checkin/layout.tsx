import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Daily Check-in | InvoicePatch',
  description: 'Quick daily verification of work charges and expenses for your InvoicePatch trial.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f9fafb' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' }
  ],
};

export default function DailyCheckInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mobile-container">
      {children}
    </div>
  );
} 