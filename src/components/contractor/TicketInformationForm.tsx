'use client';

import { useState } from 'react';
import { 
  DollarSign, 
  Truck, 
  MapPin, 
  Coffee, 
  Plus,
  Save,
  Calculator,
  Receipt
} from 'lucide-react';

interface TicketInfo {
  dayRate: number;
  truckRate: number;
  kmsRate: number;
  kmsDriven: number;
  subsistence: number;
  others: { description: string; amount: number }[];
  date: string;
  wellSite: string;
  operator: string;
}

const TicketInformationForm = () => {
  const [ticketInfo, setTicketInfo] = useState<TicketInfo>({
    dayRate: 0,
    truckRate: 0,
    kmsRate: 0,
    kmsDriven: 0,
    subsistence: 0,
    others: [],
    date: new Date().toISOString().split('T')[0],
    wellSite: '',
    operator: ''
  });

  const [newOtherItem, setNewOtherItem] = useState({ description: '', amount: 0 });
  const [isSaved, setIsSaved] = useState(false);

  const handleInputChange = (field: keyof TicketInfo, value: any) => {
    setTicketInfo(prev => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const addOtherItem = () => {
    if (newOtherItem.description && newOtherItem.amount > 0) {
      setTicketInfo(prev => ({
        ...prev,
        others: [...prev.others, { ...newOtherItem }]
      }));
      setNewOtherItem({ description: '', amount: 0 });
      setIsSaved(false);
    }
  };

  const removeOtherItem = (index: number) => {
    setTicketInfo(prev => ({
      ...prev,
      others: prev.others.filter((_, i) => i !== index)
    }));
    setIsSaved(false);
  };

  const calculateTotal = () => {
    const kmsTotal = ticketInfo.kmsRate * ticketInfo.kmsDriven;
    const othersTotal = ticketInfo.others.reduce((sum, item) => sum + item.amount, 0);
    return ticketInfo.dayRate + ticketInfo.truckRate + kmsTotal + ticketInfo.subsistence + othersTotal;
  };

  const handleSave = () => {
    // In real app, would save to backend
    console.log('Saving ticket info:', ticketInfo);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <Receipt className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Daily Ticket Information</h3>
            <p className="text-sm text-gray-600">Enter your daily rates and expenses</p>
          </div>
        </div>
        {isSaved && (
          <div className="flex items-center space-x-2 text-green-600">
            <Save className="w-4 h-4" />
            <span className="text-sm font-medium">Saved</span>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              value={ticketInfo.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Well Site
            </label>
            <input
              type="text"
              value={ticketInfo.wellSite}
              onChange={(e) => handleInputChange('wellSite', e.target.value)}
              placeholder="e.g., 12-24-049-25W4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Operator
          </label>
          <input
            type="text"
            value={ticketInfo.operator}
            onChange={(e) => handleInputChange('operator', e.target.value)}
            placeholder="e.g., Suncor Energy"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Rates and Expenses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Day Rate */}
          <div className="space-y-1">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <DollarSign className="w-4 h-4" />
              <span>Day Rate ($)</span>
            </label>
            <input
              type="number"
              step="0.01"
              value={ticketInfo.dayRate || ''}
              onChange={(e) => handleInputChange('dayRate', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Truck Rate */}
          <div className="space-y-1">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <Truck className="w-4 h-4" />
              <span>Truck Rate ($)</span>
            </label>
            <input
              type="number"
              step="0.01"
              value={ticketInfo.truckRate || ''}
              onChange={(e) => handleInputChange('truckRate', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* KMs Rate */}
          <div className="space-y-1">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <MapPin className="w-4 h-4" />
              <span>KMs Rate ($/km)</span>
            </label>
            <input
              type="number"
              step="0.01"
              value={ticketInfo.kmsRate || ''}
              onChange={(e) => handleInputChange('kmsRate', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* KMs Driven */}
          <div className="space-y-1">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <MapPin className="w-4 h-4" />
              <span>KMs Driven</span>
            </label>
            <input
              type="number"
              value={ticketInfo.kmsDriven || ''}
              onChange={(e) => handleInputChange('kmsDriven', parseInt(e.target.value) || 0)}
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Subsistence */}
          <div className="space-y-1 md:col-span-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <Coffee className="w-4 h-4" />
              <span>Subsistence ($)</span>
            </label>
            <input
              type="number"
              step="0.01"
              value={ticketInfo.subsistence || ''}
              onChange={(e) => handleInputChange('subsistence', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Others Section */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900">Other Expenses</h4>
          
          {/* Existing Other Items */}
          {ticketInfo.others.map((item, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">{item.description}</span>
              </div>
              <div className="text-sm font-medium text-gray-900">
                {formatCurrency(item.amount)}
              </div>
              <button
                onClick={() => removeOtherItem(index)}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </div>
          ))}

          {/* Add New Other Item */}
          <div className="flex space-x-3">
            <input
              type="text"
              value={newOtherItem.description}
              onChange={(e) => setNewOtherItem(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Description (e.g., Tools, Safety Equipment)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <input
              type="number"
              step="0.01"
              value={newOtherItem.amount || ''}
              onChange={(e) => setNewOtherItem(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
              placeholder="Amount"
              className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button
              onClick={addOtherItem}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Total Calculation */}
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-green-600" />
              <span className="text-lg font-semibold text-gray-900">Total Daily Amount</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(calculateTotal())}
            </div>
          </div>
          
          {/* Breakdown */}
          <div className="mt-3 space-y-1 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Day Rate:</span>
              <span>{formatCurrency(ticketInfo.dayRate)}</span>
            </div>
            <div className="flex justify-between">
              <span>Truck Rate:</span>
              <span>{formatCurrency(ticketInfo.truckRate)}</span>
            </div>
            <div className="flex justify-between">
              <span>KMs ({ticketInfo.kmsDriven} × {formatCurrency(ticketInfo.kmsRate)}):</span>
              <span>{formatCurrency(ticketInfo.kmsRate * ticketInfo.kmsDriven)}</span>
            </div>
            <div className="flex justify-between">
              <span>Subsistence:</span>
              <span>{formatCurrency(ticketInfo.subsistence)}</span>
            </div>
            {ticketInfo.others.length > 0 && (
              <div className="flex justify-between">
                <span>Other Expenses:</span>
                <span>{formatCurrency(ticketInfo.others.reduce((sum, item) => sum + item.amount, 0))}</span>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Save className="w-5 h-5" />
          <span>Save Ticket Information</span>
        </button>
      </div>
    </div>
  );
};

export default TicketInformationForm;
