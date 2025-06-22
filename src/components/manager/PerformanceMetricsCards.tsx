'use client';

import { TrendingUp, TrendingDown, Clock, DollarSign, FileText, AlertTriangle, CheckCircle } from 'lucide-react';

interface MetricCard {
  id: string;
  title: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: React.ReactNode;
  color: string;
  description: string;
  target?: string;
}

const PerformanceMetricsCards = () => {
  const metrics: MetricCard[] = [
    {
      id: 'processing-time',
      title: 'Avg Processing Time',
      value: '11.2 min',
      change: -15.3,
      changeType: 'decrease',
      icon: <Clock className="w-6 h-6" />,
      color: 'blue',
      description: 'Per invoice processing time',
      target: '10 min'
    },
    {
      id: 'accuracy-rate',
      title: 'Accuracy Rate',
      value: '96.8%',
      change: 2.1,
      changeType: 'increase',
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'green',
      description: 'Invoice processing accuracy',
      target: '98%'
    },
    {
      id: 'monthly-volume',
      title: 'Monthly Volume',
      value: '2,847',
      change: 8.4,
      changeType: 'increase',
      icon: <FileText className="w-6 h-6" />,
      color: 'purple',
      description: 'Invoices processed this month'
    },
    {
      id: 'cost-savings',
      title: 'Cost Savings',
      value: '$47,320',
      change: 12.7,
      changeType: 'increase',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'emerald',
      description: 'Monthly automation savings'
    },
    {
      id: 'error-rate',
      title: 'Error Rate',
      value: '3.2%',
      change: -1.8,
      changeType: 'decrease',
      icon: <AlertTriangle className="w-6 h-6" />,
      color: 'red',
      description: 'Issues requiring manual review'
    },
    {
      id: 'team-productivity',
      title: 'Team Productivity',
      value: '127%',
      change: 5.2,
      changeType: 'increase',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'indigo',
      description: 'vs. baseline performance'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      emerald: 'bg-emerald-100 text-emerald-600',
      red: 'bg-red-100 text-red-600',
      indigo: 'bg-indigo-100 text-indigo-600'
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-100 text-gray-600';
  };

  const getChangeColor = (changeType: 'increase' | 'decrease', isPositive: boolean) => {
    if ((changeType === 'increase' && isPositive) || (changeType === 'decrease' && !isPositive)) {
      return 'text-green-600';
    }
    return 'text-red-600';
  };

  const isPositiveChange = (id: string, changeType: 'increase' | 'decrease') => {
    // For error rate, decrease is positive
    if (id === 'error-rate') {
      return changeType === 'decrease';
    }
    // For processing time, decrease is positive
    if (id === 'processing-time') {
      return changeType === 'decrease';
    }
    // For everything else, increase is positive
    return changeType === 'increase';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((metric) => (
        <div key={metric.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(metric.color)}`}>
              {metric.icon}
            </div>
            <div className={`flex items-center space-x-1 text-sm font-medium ${getChangeColor(metric.changeType, isPositiveChange(metric.id, metric.changeType))}`}>
              {isPositiveChange(metric.id, metric.changeType) ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{Math.abs(metric.change)}%</span>
            </div>
          </div>

          <div className="mb-2">
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</h3>
            <p className="text-sm font-medium text-gray-900">{metric.title}</p>
            <p className="text-xs text-gray-500">{metric.description}</p>
          </div>

          {metric.target && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Target</span>
                <span className="font-medium text-gray-700">{metric.target}</span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${metric.color === 'blue' ? 'bg-blue-500' : 
                    metric.color === 'green' ? 'bg-green-500' : 'bg-purple-500'}`}
                  style={{ 
                    width: metric.id === 'processing-time' ? '89%' : 
                           metric.id === 'accuracy-rate' ? '99%' : '75%' 
                  }}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PerformanceMetricsCards; 