import { GetServerSideProps } from 'next';
import React from 'react';
import { PayPeriodProvider, usePayPeriodCtx } from '../../context/PayPeriodProvider';

// Stub SummaryCard
const SummaryCard = ({ title, value }: { title: string; value: string | number }) => (
  <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center justify-center min-h-[100px]">
    <div className="text-xs text-gray-500 mb-1">{title}</div>
    <div className="text-2xl font-bold">{value}</div>
  </div>
);

// Stub ComplianceBar
const ComplianceBar = () => (
  <div className="bg-white rounded-lg shadow p-4 my-4">
    <div className="text-sm font-semibold mb-2">Compliance Progress</div>
    <div className="h-4 w-full bg-gray-200 rounded overflow-hidden">
      <div className="h-4 bg-green-400 w-2/3" />
    </div>
  </div>
);

// Stub FlagTable
const FlagTable = () => (
  <div className="bg-white rounded-lg shadow p-4 mt-4">
    <div className="text-sm font-semibold mb-2">Latest Change Notifications</div>
    <table className="w-full text-sm">
      <thead>
        <tr>
          <th className="text-left py-1">Type</th>
          <th className="text-left py-1">Message</th>
          <th className="text-left py-1">Date</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="py-1">Flag</td>
          <td className="py-1">Example notification</td>
          <td className="py-1">2024-07-01</td>
        </tr>
      </tbody>
    </table>
  </div>
);

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // TODO: Replace with real session check
  const user = null; // e.g., getUserFromSession(ctx.req)
  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  return { props: {} };
};

const DashboardContent = () => {
  const { list, isLoading } = usePayPeriodCtx();
  // Example summary values (replace with real calculations)
  const activePeriods = list.filter((p: any) => !p.is_closed).length;
  const hoursPending = 42;
  const flags = 2;
  const unverified = 1200;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-2">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <SummaryCard title="Active Periods" value={activePeriods} />
          <SummaryCard title="Hours Pending" value={hoursPending} />
          <SummaryCard title="Flags" value={flags} />
          <SummaryCard title="$ Unverified" value={unverified} />
        </div>
        <ComplianceBar />
        <FlagTable />
      </div>
    </div>
  );
};

const DashboardPage = () => (
  <PayPeriodProvider>
    <DashboardContent />
  </PayPeriodProvider>
);

export default DashboardPage; 