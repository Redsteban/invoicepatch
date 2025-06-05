'use client';

import { useState } from 'react';

const ReconciliationResults = () => {
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);

  const perfectMatches = [
    { id: '1', contractor: 'John Smith', ticket: '#ST-123', amount: '$2,847.50' },
    { id: '2', contractor: 'Sarah Johnson', ticket: '#ST-124', amount: '$1,980.00' },
    { id: '3', contractor: 'Mike Wilson', ticket: '#ST-125', amount: '$3,150.75' },
    { id: '4', contractor: 'Lisa Davis', ticket: '#ST-126', amount: '$2,475.25' },
    { id: '5', contractor: 'Tom Anderson', ticket: '#ST-127', amount: '$2,890.50' }
  ];

  const issues = [
    {
      id: '1',
      contractor: 'Mike Brown',
      ticket: '#ST-128',
      amount: '$2,847.50',
      issue: 'Rate mismatch: $475 vs $450',
      type: 'rate'
    },
    {
      id: '2', 
      contractor: 'Jennifer Lee',
      ticket: '#ST-129',
      amount: '$1,650.00',
      issue: 'Missing AFE code',
      type: 'afe'
    },
    {
      id: '3',
      contractor: 'David Chen',
      ticket: '#ST-130', 
      amount: '$3,420.75',
      issue: 'Overtime exceeds limit: 14h vs 12h',
      type: 'overtime'
    },
    {
      id: '4',
      contractor: 'Amy Rodriguez', 
      ticket: '#ST-131',
      amount: '$2,100.00',
      issue: 'Work date outside contract period',
      type: 'date'
    }
  ];

  const handleIssueAction = (issueId: string, action: string) => {
    console.log(`Issue ${issueId}: ${action}`);
    // Handle issue resolution
  };

  const handleApproveAll = () => {
    console.log('Approving all perfect matches');
    // Handle bulk approval
  };

  const handleExport = (type: string) => {
    console.log(`Exporting to ${type}`);
    // Handle export
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Simple header */}
      <div className="bg-[#f9fafb] border-b border-[#e5e7eb]">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-[#1a1a1a]">Process All Contractor Payments in Minutes, Not Hours</h1>
              <p className="text-[#6b7280]">20 invoices • 38 seconds</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-[#6b7280]">Total amount</p>
              <p className="text-2xl font-semibold text-[#1a1a1a]">$47,623.50</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Perfect matches */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium text-[#1a1a1a]">Perfect matches (16)</h2>
            <button 
              onClick={handleApproveAll}
              className="text-sm bg-[#3b82f6] text-white px-4 py-2 rounded-lg hover:bg-[#2563eb] transition-colors"
            >
              Approve all • $38,970
            </button>
          </div>
          
          <div className="bg-[#f9fafb] rounded-lg p-4">
            <div className="space-y-2">
              {perfectMatches.slice(0, 3).map(match => (
                <div key={match.id} className="flex items-center justify-between py-2">
                  <div>
                    <span className="text-[#1a1a1a]">{match.contractor}</span>
                    <span className="text-sm text-[#6b7280] ml-2">{match.ticket}</span>
                  </div>
                  <span className="text-[#1a1a1a]">{match.amount}</span>
                </div>
              ))}
              <button className="text-sm text-[#6b7280] hover:text-[#1a1a1a] mt-2 transition-colors">
                Show all →
              </button>
            </div>
          </div>
        </div>
        
        {/* Issues */}
        <div className="mb-8">
          <h2 className="font-medium text-[#1a1a1a] mb-4">Need review (4)</h2>
          
          <div className="space-y-3">
            {issues.map(issue => (
              <div key={issue.id} className="border border-[#e5e7eb] rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium text-[#1a1a1a]">{issue.contractor}</p>
                    <p className="text-sm text-[#dc2626]">{issue.issue}</p>
                  </div>
                  <span className="text-[#1a1a1a]">{issue.amount}</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {issue.type === 'rate' && (
                    <>
                      <button 
                        onClick={() => handleIssueAction(issue.id, 'use_lower_rate')}
                        className="text-sm px-3 py-1 bg-[#3b82f6] text-white rounded hover:bg-[#2563eb] transition-colors"
                      >
                        Use $450
                      </button>
                      <button 
                        onClick={() => handleIssueAction(issue.id, 'accept_higher_rate')}
                        className="text-sm px-3 py-1 border border-[#e5e7eb] rounded hover:bg-[#f9fafb] transition-colors"
                      >
                        Accept $475
                      </button>
                    </>
                  )}
                  {issue.type === 'afe' && (
                    <>
                      <button 
                        onClick={() => handleIssueAction(issue.id, 'assign_afe')}
                        className="text-sm px-3 py-1 bg-[#3b82f6] text-white rounded hover:bg-[#2563eb] transition-colors"
                      >
                        Assign AFE
                      </button>
                      <button 
                        onClick={() => handleIssueAction(issue.id, 'reject_no_afe')}
                        className="text-sm px-3 py-1 border border-[#e5e7eb] rounded hover:bg-[#f9fafb] transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {issue.type === 'overtime' && (
                    <>
                      <button 
                        onClick={() => handleIssueAction(issue.id, 'approve_overtime')}
                        className="text-sm px-3 py-1 bg-[#3b82f6] text-white rounded hover:bg-[#2563eb] transition-colors"
                      >
                        Approve overtime
                      </button>
                      <button 
                        onClick={() => handleIssueAction(issue.id, 'cap_hours')}
                        className="text-sm px-3 py-1 border border-[#e5e7eb] rounded hover:bg-[#f9fafb] transition-colors"
                      >
                        Cap at 12h
                      </button>
                    </>
                  )}
                  {issue.type === 'date' && (
                    <>
                      <button 
                        onClick={() => handleIssueAction(issue.id, 'approve_exception')}
                        className="text-sm px-3 py-1 bg-[#3b82f6] text-white rounded hover:bg-[#2563eb] transition-colors"
                      >
                        Approve exception
                      </button>
                      <button 
                        onClick={() => handleIssueAction(issue.id, 'reject_date')}
                        className="text-sm px-3 py-1 border border-[#e5e7eb] rounded hover:bg-[#f9fafb] transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button 
                    onClick={() => handleIssueAction(issue.id, 'ask_contractor')}
                    className="text-sm px-3 py-1 border border-[#e5e7eb] rounded hover:bg-[#f9fafb] transition-colors"
                  >
                    Ask contractor
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-3">
          <button 
            onClick={() => handleExport('quickbooks')}
            className="flex-1 py-3 bg-[#3b82f6] text-white rounded-lg font-medium hover:bg-[#2563eb] transition-colors"
          >
            Export to QuickBooks
          </button>
          <button 
            onClick={() => handleExport('report')}
            className="flex-1 py-3 border border-[#e5e7eb] rounded-lg hover:bg-[#f9fafb] transition-colors text-[#1a1a1a]"
          >
            Download report
          </button>
        </div>

        {/* Summary stats */}
        <div className="mt-8 pt-8 border-t border-[#f3f4f6]">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-semibold text-[#1a1a1a]">80%</div>
              <div className="text-sm text-[#6b7280]">Auto-approved</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-[#1a1a1a]">38s</div>
              <div className="text-sm text-[#6b7280]">Processing time</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-[#1a1a1a]">7.2h</div>
              <div className="text-sm text-[#6b7280]">Time saved</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReconciliationResults; 