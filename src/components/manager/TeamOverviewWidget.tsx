'use client';

import { Users, TrendingUp, Clock, AlertCircle, CheckCircle, UserCheck } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'pending' | 'inactive';
  invoicesThisMonth: number;
  averageProcessingTime: string;
  accuracy: number;
  avatar?: string;
}

const TeamOverviewWidget = () => {
  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      role: 'Senior Processor',
      status: 'active',
      invoicesThisMonth: 145,
      averageProcessingTime: '8m',
      accuracy: 98.5
    },
    {
      id: '2',
      name: 'Mike Rodriguez',
      role: 'Invoice Specialist',
      status: 'active',
      invoicesThisMonth: 132,
      averageProcessingTime: '12m',
      accuracy: 96.2
    },
    {
      id: '3',
      name: 'Emily Watson',
      role: 'Junior Processor',
      status: 'pending',
      invoicesThisMonth: 89,
      averageProcessingTime: '15m',
      accuracy: 94.8
    },
    {
      id: '4',
      name: 'David Kim',
      role: 'Invoice Specialist',
      status: 'active',
      invoicesThisMonth: 156,
      averageProcessingTime: '9m',
      accuracy: 97.9
    }
  ];

  const teamStats = {
    totalMembers: teamMembers.length,
    activeMembers: teamMembers.filter(m => m.status === 'active').length,
    averageAccuracy: teamMembers.reduce((acc, m) => acc + m.accuracy, 0) / teamMembers.length,
    totalInvoicesProcessed: teamMembers.reduce((acc, m) => acc + m.invoicesThisMonth, 0)
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'inactive':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <UserCheck className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Team Overview</h3>
            <p className="text-sm text-gray-500">Invoice processing team performance</p>
          </div>
        </div>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          View All
        </button>
      </div>

      {/* Team Stats Summary */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{teamStats.totalMembers}</div>
          <div className="text-xs text-gray-500">Total Members</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{teamStats.activeMembers}</div>
          <div className="text-xs text-gray-500">Active</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{teamStats.averageAccuracy.toFixed(1)}%</div>
          <div className="text-xs text-gray-500">Avg Accuracy</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{teamStats.totalInvoicesProcessed}</div>
          <div className="text-xs text-gray-500">Invoices</div>
        </div>
      </div>

      {/* Team Members List */}
      <div className="space-y-3">
        {teamMembers.map((member) => (
          <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-gray-900">{member.name}</h4>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                    {getStatusIcon(member.status)}
                    <span className="ml-1 capitalize">{member.status}</span>
                  </span>
                </div>
                <p className="text-sm text-gray-500">{member.role}</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center space-x-4 text-sm">
                <div className="text-center">
                  <div className="font-medium text-gray-900">{member.invoicesThisMonth}</div>
                  <div className="text-xs text-gray-500">Invoices</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-900">{member.averageProcessingTime}</div>
                  <div className="text-xs text-gray-500">Avg Time</div>
                </div>
                <div className="text-center">
                  <div className={`font-medium ${member.accuracy >= 97 ? 'text-green-600' : member.accuracy >= 95 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {member.accuracy}%
                  </div>
                  <div className="text-xs text-gray-500">Accuracy</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex space-x-3">
          <button className="flex-1 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
            Add Team Member
          </button>
          <button className="flex-1 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium">
            Performance Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamOverviewWidget; 