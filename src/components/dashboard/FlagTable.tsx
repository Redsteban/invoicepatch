import React from 'react';
import Link from 'next/link';

export interface Flag {
  id: string;
  pay_period_id: string;
  entry_id: string;
  type: string;
  message: string;
  date: string;
}

export interface FlagTableProps {
  flags: Flag[];
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const FlagTable: React.FC<FlagTableProps> = ({ flags, page, pageSize, onPageChange }) => {
  const totalPages = Math.ceil(flags.length / pageSize);
  const paged = flags.slice((page - 1) * pageSize, page * pageSize);
  return (
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
          {paged.map(flag => (
            <tr key={flag.id} className="hover:bg-gray-50">
              <td className="py-1">{flag.type}</td>
              <td className="py-1">
                <Link href={`/pay-periods/${flag.pay_period_id}?entry=${flag.entry_id}`} className="text-blue-600 underline">
                  {flag.message}
                </Link>
              </td>
              <td className="py-1">{flag.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end gap-2 mt-2">
        <button className="btn btn-xs" disabled={page === 1} onClick={() => onPageChange(page - 1)}>Prev</button>
        <span className="text-xs">Page {page} of {totalPages}</span>
        <button className="btn btn-xs" disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>Next</button>
      </div>
    </div>
  );
}; 