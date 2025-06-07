'use client';

import React, { useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface AccordionItemProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  headerAction?: React.ReactNode;
  className?: string;
}

interface AccordionProps {
  children: React.ReactElement<AccordionItemProps>[];
  allowMultiple?: boolean;
  className?: string;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  subtitle,
  badge,
  children,
  defaultOpen = false,
  headerAction,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      <button
        className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className="flex-shrink-0">
              {isOpen ? (
                <ChevronDownIcon className="h-5 w-5 text-gray-500 transition-transform" />
              ) : (
                <ChevronRightIcon className="h-5 w-5 text-gray-500 transition-transform" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-3">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {title}
                </h3>
                {badge && <div>{badge}</div>}
              </div>
              {subtitle && (
                <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
              )}
            </div>
          </div>
          {headerAction && (
            <div className="flex-shrink-0 ml-4" onClick={(e) => e.stopPropagation()}>
              {headerAction}
            </div>
          )}
        </div>
      </button>
      
      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          {children}
        </div>
      </div>
    </div>
  );
};

export const Accordion: React.FC<AccordionProps> = ({
  children,
  allowMultiple = false,
  className = ''
}) => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const handleItemToggle = (index: number) => {
    if (allowMultiple) {
      const newOpenItems = new Set(openItems);
      if (newOpenItems.has(index)) {
        newOpenItems.delete(index);
      } else {
        newOpenItems.add(index);
      }
      setOpenItems(newOpenItems);
    } else {
      setOpenItems(openItems.has(index) ? new Set() : new Set([index]));
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            key: index,
            defaultOpen: openItems.has(index),
            onClick: () => handleItemToggle(index)
          });
        }
        return child;
      })}
    </div>
  );
};

// Specialized Work Entry Accordion Component
interface WorkEntryAccordionProps {
  entries: any[];
  onEditEntry?: (entry: any) => void;
  onDeleteEntry?: (entryId: string) => void;
  calculateDayEarnings: (entry: any) => number;
  formatDate: (date: string) => string;
  rateType?: 'daily' | 'hourly';
}

export const WorkEntryAccordion: React.FC<WorkEntryAccordionProps> = ({
  entries,
  onEditEntry,
  onDeleteEntry,
  calculateDayEarnings,
  formatDate,
  rateType = 'daily'
}) => {
  // Group entries by week
  const groupedEntries = entries.reduce((groups, entry) => {
    const entryDate = new Date(entry.entry_date);
    const weekStart = new Date(entryDate);
    weekStart.setDate(entryDate.getDate() - entryDate.getDay()); // Start of week (Sunday)
    const weekKey = weekStart.toISOString().split('T')[0];
    
    if (!groups[weekKey]) {
      groups[weekKey] = [];
    }
    groups[weekKey].push(entry);
    return groups;
  }, {} as Record<string, any[]>);

  const getWeekEarnings = (weekEntries: any[]) => {
    return weekEntries.reduce((sum, entry) => sum + calculateDayEarnings(entry), 0);
  };

  const getWeekSummary = (weekEntries: any[]) => {
    const workDays = weekEntries.filter(e => e.worked).length;
    const totalDays = weekEntries.length;
    return `${workDays}/${totalDays} days worked`;
  };

  return (
    <div className="space-y-4">
      {Object.entries(groupedEntries)
        .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
        .map(([weekStart, weekEntries]) => {
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekEnd.getDate() + 6);
          const weekEarnings = getWeekEarnings(weekEntries);
          
          return (
            <AccordionItem
              key={weekStart}
              title={`Week of ${formatDate(weekStart)}`}
              subtitle={getWeekSummary(weekEntries)}
              badge={
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  ${weekEarnings.toFixed(2)}
                </span>
              }
              defaultOpen={false}
              className="shadow-sm"
            >
              <div className="space-y-3">
                {weekEntries
                  .sort((a, b) => new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime())
                  .map((entry) => (
                    <div
                      key={entry.id}
                      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <span className="text-2xl">
                              {entry.worked ? '✅' : '🏠'}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {formatDate(entry.entry_date)}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {entry.worked ? 'Work day' : 'Day off'}
                              {rateType === 'hourly' && entry.hours_worked && (
                                <span className="ml-2 text-blue-600">
                                  ({entry.hours_worked}h)
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              ${calculateDayEarnings(entry).toFixed(2)}
                            </p>
                            {entry.worked && (
                              <p className="text-xs text-gray-500">
                                {rateType === 'hourly' ? (
                                  `${entry.hours_worked || 0}h × $${entry.hourly_rate || 0}`
                                ) : (
                                  `Day: $${entry.day_rate_used}`
                                )}
                              </p>
                            )}
                          </div>
                          
                          {(onEditEntry || onDeleteEntry) && (
                            <div className="flex space-x-2">
                              {onEditEntry && (
                                <button
                                  onClick={() => onEditEntry(entry)}
                                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                  title="Edit entry"
                                >
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                              )}
                              {onDeleteEntry && (
                                <button
                                  onClick={() => onDeleteEntry(entry.id)}
                                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                  title="Delete entry"
                                >
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {entry.worked && entry.notes && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-sm text-gray-600">
                            <strong>Notes:</strong> {entry.notes}
                          </p>
                        </div>
                      )}
                      
                      {entry.worked && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Travel:</span>
                              <span className="ml-1 font-medium">
                                ${((entry.travel_kms_actual || 0) * 0.68).toFixed(2)}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Truck:</span>
                              <span className="ml-1 font-medium">
                                ${entry.truck_rate_used || 0}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Subsistence:</span>
                              <span className="ml-1 font-medium">
                                ${entry.subsistence_actual || 0}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">GST:</span>
                              <span className="ml-1 font-medium">
                                ${(calculateDayEarnings(entry) * 0.05).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </AccordionItem>
          );
        })}
    </div>
  );
}; 