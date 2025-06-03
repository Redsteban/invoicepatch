'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DocumentTextIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  TruckIcon,
  MapIcon,
  CakeIcon,
  CalendarDaysIcon,
  ClockIcon,
  EyeIcon,
  BookmarkIcon,
  PlayIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { TrialManager, type TrialData } from '@/lib/trialManager';

interface InvoiceSetupData {
  ticketNumber: string;
  location: string;
  company: string;
  dayRate: string;
  truckRate: string;
  travelKMs: string;
  taxFreeSubsistence: string;
  workStartDate: string;
  workDays: string[];
  invoiceFrequency: string;
}

const WORK_DAYS = [
  { id: 'monday', label: 'Mon', full: 'Monday' },
  { id: 'tuesday', label: 'Tue', full: 'Tuesday' },
  { id: 'wednesday', label: 'Wed', full: 'Wednesday' },
  { id: 'thursday', label: 'Thu', full: 'Thursday' },
  { id: 'friday', label: 'Fri', full: 'Friday' },
  { id: 'saturday', label: 'Sat', full: 'Saturday' },
  { id: 'sunday', label: 'Sun', full: 'Sunday' }
];

const INVOICE_FREQUENCIES = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'bi-weekly', label: 'Bi-weekly' }
];

const TrialSetupPage = () => {
  const [formData, setFormData] = useState<InvoiceSetupData>({
    ticketNumber: '',
    location: '',
    company: '',
    dayRate: '',
    truckRate: '',
    travelKMs: '',
    taxFreeSubsistence: '',
    workStartDate: '',
    workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    invoiceFrequency: 'weekly'
  });

  const [errors, setErrors] = useState<Partial<Record<keyof InvoiceSetupData, string>>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load draft from localStorage on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('invoicepatch-trial-draft');
    if (savedDraft) {
      try {
        const draftData = JSON.parse(savedDraft);
        setFormData(draftData);
        setIsDraft(true);
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, []);

  // Auto-save draft to localStorage
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      if (Object.values(formData).some(value => Array.isArray(value) ? value.length > 0 : value !== '')) {
        localStorage.setItem('invoicepatch-trial-draft', JSON.stringify(formData));
        setIsDraft(true);
      }
    }, 1000);

    return () => clearTimeout(saveTimeout);
  }, [formData]);

  const handleInputChange = (field: keyof InvoiceSetupData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleWorkDayToggle = (dayId: string) => {
    setFormData(prev => ({
      ...prev,
      workDays: prev.workDays.includes(dayId)
        ? prev.workDays.filter(day => day !== dayId)
        : [...prev.workDays, dayId]
    }));
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof InvoiceSetupData, string>> = {};

    if (!formData.ticketNumber.trim()) newErrors.ticketNumber = 'Ticket number is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.company.trim()) newErrors.company = 'Company name is required';
    if (!formData.dayRate || parseFloat(formData.dayRate) <= 0) newErrors.dayRate = 'Valid day rate is required';
    if (!formData.truckRate || parseFloat(formData.truckRate) <= 0) newErrors.truckRate = 'Valid truck rate is required';
    if (!formData.travelKMs || parseFloat(formData.travelKMs) < 0) newErrors.travelKMs = 'Valid travel distance is required';
    if (!formData.taxFreeSubsistence || parseFloat(formData.taxFreeSubsistence) < 0) newErrors.taxFreeSubsistence = 'Valid subsistence amount is required';
    if (!formData.workStartDate) newErrors.workStartDate = 'Work start date is required';
    if (formData.workDays.length === 0) newErrors.workDays = 'At least one work day must be selected' as any;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculatePreview = () => {
    const dayRate = parseFloat(formData.dayRate) || 0;
    const truckRate = parseFloat(formData.truckRate) || 0;
    const subsistence = parseFloat(formData.taxFreeSubsistence) || 0;
    const travelKMs = parseFloat(formData.travelKMs) || 0;
    
    const subtotal = dayRate + truckRate + subsistence;
    const gst = subtotal * 0.05; // 5% GST
    const total = subtotal + gst;

    return {
      dayRate,
      truckRate,
      subsistence,
      travelKMs,
      subtotal,
      gst,
      total
    };
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem('invoicepatch-trial-draft', JSON.stringify(formData));
      setIsDraft(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      alert('Draft saved successfully!');
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Error saving draft. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleStartTrial = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      // Initialize trial using TrialManager
      const trialData = TrialManager.initializeTrial({
        ticketNumber: formData.ticketNumber,
        location: formData.location,
        company: formData.company,
        dayRate: formData.dayRate,
        truckRate: formData.truckRate,
        travelKMs: formData.travelKMs,
        taxFreeSubsistence: formData.taxFreeSubsistence,
        workStartDate: formData.workStartDate,
        workDays: [...formData.workDays],
        invoiceFrequency: formData.invoiceFrequency
      });

      // Clear draft
      localStorage.removeItem('invoicepatch-trial-draft');
      
      // Simulate API call to register trial
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to success page with trial started flag
      window.location.href = '/success?trial=started';
    } catch (error) {
      console.error('Error starting trial:', error);
      alert('Error starting trial. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      localStorage.removeItem('invoicepatch-trial-draft');
      window.location.href = '/';
    }
  };

  const preview = calculatePreview();

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Invoice Setup - Start Your Trial
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enter your invoice details to begin automated daily check-ins and streamlined billing.
          </p>
          {isDraft && (
            <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200">
              <BookmarkIcon className="h-4 w-4 mr-1" />
              Draft saved automatically
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
              <form className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <DocumentTextIcon className="h-6 w-6 mr-2" />
                    Basic Information
                  </h2>

                  {/* Ticket Number */}
                  <div>
                    <label htmlFor="ticketNumber" className="block text-sm font-medium text-gray-700 mb-2">
                      Ticket Number *
                    </label>
                    <input
                      type="text"
                      id="ticketNumber"
                      value={formData.ticketNumber}
                      onChange={(e) => handleInputChange('ticketNumber', e.target.value)}
                      placeholder="Enter ticket number to start sequence"
                      className={`w-full px-4 py-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.ticketNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {errors.ticketNumber && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                        {errors.ticketNumber}
                      </p>
                    )}
                  </div>

                  {/* Location */}
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPinIcon className="h-4 w-4 inline mr-1" />
                      Job Site Location *
                    </label>
                    <input
                      type="text"
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="e.g., Calgary Downtown"
                      className={`w-full px-4 py-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.location ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {errors.location && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                        {errors.location}
                      </p>
                    )}
                  </div>

                  {/* Company */}
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      <BuildingOfficeIcon className="h-4 w-4 inline mr-1" />
                      Client Company Name *
                    </label>
                    <input
                      type="text"
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      placeholder="Enter client company name"
                      className={`w-full px-4 py-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.company ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {errors.company && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                        {errors.company}
                      </p>
                    )}
                  </div>
                </div>

                {/* Rate Information */}
                <div className="space-y-6 border-t border-gray-200 pt-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <CurrencyDollarIcon className="h-6 w-6 mr-2" />
                    Rate Information
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Day Rate */}
                    <div>
                      <label htmlFor="dayRate" className="block text-sm font-medium text-gray-700 mb-2">
                        Daily Labor Rate ($) *
                      </label>
                      <input
                        type="number"
                        id="dayRate"
                        step="0.01"
                        min="0"
                        value={formData.dayRate}
                        onChange={(e) => handleInputChange('dayRate', e.target.value)}
                        placeholder="750.00"
                        className={`w-full px-4 py-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.dayRate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {errors.dayRate && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                          {errors.dayRate}
                        </p>
                      )}
                    </div>

                    {/* Truck Rate */}
                    <div>
                      <label htmlFor="truckRate" className="block text-sm font-medium text-gray-700 mb-2">
                        <TruckIcon className="h-4 w-4 inline mr-1" />
                        Daily Truck/Equipment Rate ($) *
                      </label>
                      <input
                        type="number"
                        id="truckRate"
                        step="0.01"
                        min="0"
                        value={formData.truckRate}
                        onChange={(e) => handleInputChange('truckRate', e.target.value)}
                        placeholder="200.00"
                        className={`w-full px-4 py-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.truckRate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {errors.truckRate && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                          {errors.truckRate}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Travel KMs */}
                    <div>
                      <label htmlFor="travelKMs" className="block text-sm font-medium text-gray-700 mb-2">
                        <MapIcon className="h-4 w-4 inline mr-1" />
                        Round Trip Distance (km) *
                      </label>
                      <input
                        type="number"
                        id="travelKMs"
                        step="1"
                        min="0"
                        value={formData.travelKMs}
                        onChange={(e) => handleInputChange('travelKMs', e.target.value)}
                        placeholder="50"
                        className={`w-full px-4 py-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.travelKMs ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {errors.travelKMs && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                          {errors.travelKMs}
                        </p>
                      )}
                    </div>

                    {/* Tax-Free Subsistence */}
                    <div>
                      <label htmlFor="taxFreeSubsistence" className="block text-sm font-medium text-gray-700 mb-2">
                        <CakeIcon className="h-4 w-4 inline mr-1" />
                        Daily Meal Allowance ($) *
                      </label>
                      <input
                        type="number"
                        id="taxFreeSubsistence"
                        step="0.01"
                        min="0"
                        value={formData.taxFreeSubsistence}
                        onChange={(e) => handleInputChange('taxFreeSubsistence', e.target.value)}
                        placeholder="75.00"
                        className={`w-full px-4 py-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.taxFreeSubsistence ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      <p className="mt-1 text-xs text-gray-500">Tax-free subsistence allowance</p>
                      {errors.taxFreeSubsistence && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                          {errors.taxFreeSubsistence}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Schedule Information */}
                <div className="space-y-6 border-t border-gray-200 pt-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <CalendarDaysIcon className="h-6 w-6 mr-2" />
                    Schedule Information
                  </h2>

                  {/* Work Start Date */}
                  <div>
                    <label htmlFor="workStartDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Work Start Date *
                    </label>
                    <input
                      type="date"
                      id="workStartDate"
                      value={formData.workStartDate}
                      onChange={(e) => handleInputChange('workStartDate', e.target.value)}
                      className={`w-full px-4 py-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.workStartDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {errors.workStartDate && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                        {errors.workStartDate}
                      </p>
                    )}
                  </div>

                  {/* Work Days */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Expected Work Days *
                    </label>
                    <div className="grid grid-cols-7 gap-2">
                      {WORK_DAYS.map((day) => (
                        <button
                          key={day.id}
                          type="button"
                          onClick={() => handleWorkDayToggle(day.id)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors touch-target ${
                            formData.workDays.includes(day.id)
                              ? 'bg-blue-100 text-blue-700 border-blue-300'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <span className="block sm:hidden">{day.label}</span>
                          <span className="hidden sm:block">{day.full}</span>
                        </button>
                      ))}
                    </div>
                    {errors.workDays && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                        {errors.workDays}
                      </p>
                    )}
                  </div>

                  {/* Invoice Frequency */}
                  <div>
                    <label htmlFor="invoiceFrequency" className="block text-sm font-medium text-gray-700 mb-2">
                      <ClockIcon className="h-4 w-4 inline mr-1" />
                      Invoice Frequency
                    </label>
                    <select
                      id="invoiceFrequency"
                      value={formData.invoiceFrequency}
                      onChange={(e) => handleInputChange('invoiceFrequency', e.target.value)}
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      {INVOICE_FREQUENCIES.map((freq) => (
                        <option key={freq.value} value={freq.value}>
                          {freq.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    disabled={isSaving}
                    className="flex-1 flex items-center justify-center px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 transition-colors touch-target disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <BookmarkIcon className="h-5 w-5 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Draft'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex-1 flex items-center justify-center px-6 py-3 text-base font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 focus:ring-2 focus:ring-blue-500 transition-colors touch-target"
                  >
                    <EyeIcon className="h-5 w-5 mr-2" />
                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleStartTrial}
                    disabled={isSaving}
                    className="flex-1 flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 transition-colors touch-target disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <PlayIcon className="h-5 w-5 mr-2" />
                    {isSaving ? 'Starting...' : 'Start Trial'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex items-center justify-center px-6 py-3 text-base font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 focus:ring-2 focus:ring-red-500 transition-colors touch-target"
                  >
                    <XMarkIcon className="h-5 w-5 mr-2" />
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>

          {/* Preview Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6 transition-all duration-300 ${
              showPreview ? 'opacity-100' : 'opacity-50 lg:opacity-100'
            }`}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <EyeIcon className="h-5 w-5 mr-2" />
                Daily Charges Preview
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Day Rate:</span>
                  <span className="font-medium">${preview.dayRate.toFixed(2)}/day</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Truck Rate:</span>
                  <span className="font-medium">${preview.truckRate.toFixed(2)}/day</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Travel:</span>
                  <span className="font-medium">{preview.travelKMs} km</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subsistence:</span>
                  <span className="font-medium">${preview.subsistence.toFixed(2)}/day</span>
                  <span className="text-xs text-green-600">(tax-free)</span>
                </div>
                
                <hr className="border-gray-200" />
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Daily Subtotal:</span>
                  <span className="font-medium">${preview.subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">GST (5%):</span>
                  <span className="font-medium">${preview.gst.toFixed(2)}</span>
                </div>
                
                <hr className="border-gray-200" />
                
                <div className="flex justify-between items-center text-lg font-bold">
                  <span className="text-gray-900">Daily Total:</span>
                  <span className="text-green-600">${preview.total.toFixed(2)}</span>
                </div>

                {formData.workDays.length > 0 && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Work Schedule</h4>
                    <div className="text-sm text-blue-800">
                      <p className="mb-1">Working: {formData.workDays.length} days/week</p>
                      <p className="mb-1">
                        Weekly total: ${(preview.total * formData.workDays.length).toFixed(2)}
                      </p>
                      <p>Invoice: {formData.invoiceFrequency}</p>
                    </div>
                  </div>
                )}

                {preview.total > 0 && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center text-green-800 text-sm">
                      <CheckCircleIcon className="h-4 w-4 mr-1" />
                      Ready to start automated billing
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TrialSetupPage; 