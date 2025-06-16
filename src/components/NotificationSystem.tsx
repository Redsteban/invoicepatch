'use client';

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bell,
  X,
  Check,
  CheckCheck,
  Mail,
  MessageSquare,
  AlertTriangle,
  Info,
  FileText,
  UserCheck,
  Settings,
  Archive,
  Trash2,
  Filter,
  Search,
  ChevronDown,
  Circle,
  Clock,
  Eye,
  EyeOff,
  Smartphone,
  Volume2,
  VolumeX
} from 'lucide-react'

interface Notification {
  id: string
  type: 'system' | 'approval' | 'issue' | 'report' | 'invoice' | 'contractor'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  title: string
  message: string
  timestamp: Date
  read: boolean
  archived: boolean
  actionUrl?: string
  actionLabel?: string
  metadata?: {
    invoiceId?: string
    contractorId?: string
    amount?: number
    documentType?: string
  }
}

interface NotificationPreferences {
  inApp: {
    system: boolean
    approvals: boolean
    issues: boolean
    reports: boolean
    invoices: boolean
    contractors: boolean
  }
  email: {
    system: boolean
    approvals: boolean
    issues: boolean
    reports: boolean
    invoices: boolean
    contractors: boolean
    digest: 'immediate' | 'hourly' | 'daily' | 'weekly'
  }
  sms: {
    urgent: boolean
    criticalIssues: boolean
    highValueInvoices: boolean
    systemDown: boolean
    threshold: number // amount threshold for SMS alerts
  }
  sound: boolean
  desktop: boolean
}

const NotificationSystem: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'archived'>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showPreferences, setShowPreferences] = useState(false)
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    inApp: {
      system: true,
      approvals: true,
      issues: true,
      reports: true,
      invoices: true,
      contractors: true
    },
    email: {
      system: true,
      approvals: true,
      issues: true,
      reports: false,
      invoices: true,
      contractors: false,
      digest: 'daily'
    },
    sms: {
      urgent: true,
      criticalIssues: true,
      highValueInvoices: true,
      systemDown: true,
      threshold: 10000
    },
    sound: true,
    desktop: true
  })

  const dropdownRef = useRef<HTMLDivElement>(null)
  const wsRef = useRef<WebSocket | null>(null)

  // Mock notification data
  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'issue',
      priority: 'urgent',
      title: 'Critical Processing Error',
      message: 'Invoice processing failed for contractor ABC Corp - immediate attention required',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      archived: false,
      actionUrl: '/manager/issue-detection',
      actionLabel: 'View Issue',
      metadata: { contractorId: 'abc-corp', invoiceId: 'INV-2024-001' }
    },
    {
      id: '2',
      type: 'approval',
      priority: 'high',
      title: 'High-Value Invoice Pending',
      message: 'Invoice for $25,000 from Elite Company requires approval',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      read: false,
      archived: false,
      actionUrl: '/manager/approval-workflow',
      actionLabel: 'Review',
      metadata: { amount: 25000, contractorId: 'elite-co', invoiceId: 'INV-2024-002' }
    },
    {
      id: '3',
      type: 'system',
      priority: 'medium',
      title: 'System Maintenance Scheduled',
      message: 'Scheduled maintenance window: Tomorrow 2:00 AM - 4:00 AM EST',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true,
      archived: false
    },
    {
      id: '4',
      type: 'report',
      priority: 'low',
      title: 'Monthly Report Generated',
      message: 'Your monthly processing report is ready for review',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      read: true,
      archived: false,
      actionUrl: '/manager/reporting',
      actionLabel: 'View Report'
    },
    {
      id: '5',
      type: 'contractor',
      priority: 'medium',
      title: 'New Contractor Onboarded',
      message: 'Metro Construction has been successfully onboarded to the system',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      read: false,
      archived: false,
      metadata: { contractorId: 'metro-construction' }
    }
  ]

  useEffect(() => {
    // Initialize with mock data
    setNotifications(mockNotifications)

    // Simulate WebSocket connection for real-time updates
    const connectWebSocket = () => {
      // In production, this would connect to your WebSocket server
      // wsRef.current = new WebSocket('ws://your-websocket-server.com/notifications')
      
      // Simulate receiving new notifications
      const simulateNotifications = () => {
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: ['system', 'approval', 'issue', 'report'][Math.floor(Math.random() * 4)] as any,
          priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
          title: 'New Notification',
          message: 'This is a simulated real-time notification',
          timestamp: new Date(),
          read: false,
          archived: false
        }

        setNotifications(prev => [newNotification, ...prev])
        
        // Play notification sound if enabled
        if (preferences.sound) {
          playNotificationSound()
        }
      }

      // Simulate notifications every 30 seconds
      const interval = setInterval(simulateNotifications, 30000)
      return () => clearInterval(interval)
    }

    const cleanup = connectWebSocket()

    // Cleanup on unmount
    return () => {
      cleanup()
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [preferences.sound])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const playNotificationSound = () => {
    try {
      const audio = new Audio('/notification-sound.mp3')
      audio.play().catch(() => {
        // Fallback notification if audio file not available
        console.log('Audio notification not available')
      })
    } catch (error) {
      console.log('Notification sound not available')
    }
  }

  const getUnreadCount = () => {
    return notifications.filter(n => !n.read && !n.archived).length
  }

  const getFilteredNotifications = () => {
    let filtered = notifications.filter(notification => {
      // Filter by tab
      if (activeTab === 'unread' && notification.read) return false
      if (activeTab === 'archived' && !notification.archived) return false
      if (activeTab === 'all' && notification.archived) return false

      // Filter by category
      if (selectedCategory !== 'all' && notification.type !== selectedCategory) return false

      // Filter by search query
      if (searchQuery && !notification.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !notification.message.toLowerCase().includes(searchQuery.toLowerCase())) return false

      return true
    })

    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAsUnread = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: false } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const archiveNotification = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, archived: true } : n
    ))
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100'
      case 'high': return 'text-orange-600 bg-orange-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'system': return <Settings className="w-4 h-4" />
      case 'approval': return <UserCheck className="w-4 h-4" />
      case 'issue': return <AlertTriangle className="w-4 h-4" />
      case 'report': return <FileText className="w-4 h-4" />
      case 'invoice': return <FileText className="w-4 h-4" />
      case 'contractor': return <UserCheck className="w-4 h-4" />
      default: return <Info className="w-4 h-4" />
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return timestamp.toLocaleDateString()
  }

     const updatePreferences = (section: keyof NotificationPreferences, key: string, value: any) => {
     setPreferences(prev => {
       if (section === 'sound' || section === 'desktop') {
         return {
           ...prev,
           [section]: value
         }
       }
       return {
         ...prev,
         [section]: {
           ...prev[section],
           [key]: value
         }
       }
     })
   }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon with Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="w-6 h-6" />
        {getUnreadCount() > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {getUnreadCount() > 99 ? '99+' : getUnreadCount()}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowPreferences(!showPreferences)}
                    className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                    title="Notification Settings"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex space-x-1 mb-3">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'unread', label: 'Unread' },
                  { key: 'archived', label: 'Archived' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      activeTab === tab.key
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search and Filter */}
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search notifications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="system">System</option>
                  <option value="approval">Approvals</option>
                  <option value="issue">Issues</option>
                  <option value="report">Reports</option>
                  <option value="invoice">Invoices</option>
                  <option value="contractor">Contractors</option>
                </select>
              </div>

              {/* Quick Actions */}
              {getUnreadCount() > 0 && (
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {getUnreadCount()} unread notification{getUnreadCount() !== 1 ? 's' : ''}
                  </span>
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                  >
                    <CheckCheck className="w-3 h-3" />
                    <span>Mark all read</span>
                  </button>
                </div>
              )}
            </div>

            {/* Notification List */}
            <div className="max-h-96 overflow-y-auto">
              {getFilteredNotifications().length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p>No notifications found</p>
                </div>
              ) : (
                getFilteredNotifications().map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Type Icon */}
                      <div className={`p-2 rounded-lg ${
                        notification.type === 'issue' ? 'bg-red-100 text-red-600' :
                        notification.type === 'approval' ? 'bg-orange-100 text-orange-600' :
                        notification.type === 'system' ? 'bg-blue-100 text-blue-600' :
                        notification.type === 'report' ? 'bg-green-100 text-green-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {getTypeIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="text-sm font-medium text-gray-900 truncate">
                                {notification.title}
                              </h4>
                              <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(notification.priority)}`}>
                                {notification.priority}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="text-xs text-gray-500 flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{formatTimestamp(notification.timestamp)}</span>
                              </span>
                              {notification.actionUrl && (
                                <a
                                  href={notification.actionUrl}
                                  className="text-xs text-blue-600 hover:text-blue-700"
                                  onClick={() => setIsOpen(false)}
                                >
                                  {notification.actionLabel || 'View'}
                                </a>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-1 ml-2">
                            {!notification.read ? (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                                title="Mark as read"
                              >
                                <Check className="w-3 h-3" />
                              </button>
                            ) : (
                              <button
                                onClick={() => markAsUnread(notification.id)}
                                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                                title="Mark as unread"
                              >
                                <Circle className="w-3 h-3" />
                              </button>
                            )}
                            <button
                              onClick={() => archiveNotification(notification.id)}
                              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                              title="Archive"
                            >
                              <Archive className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="p-1 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded"
                              title="Delete"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <a
                href="/manager/notifications"
                className="block text-center text-sm text-blue-600 hover:text-blue-700"
                onClick={() => setIsOpen(false)}
              >
                View all notifications
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Preferences Modal */}
      <AnimatePresence>
        {showPreferences && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowPreferences(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* In-App Notifications */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center space-x-2">
                    <Bell className="w-5 h-5" />
                    <span>In-App Notifications</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(preferences.inApp).map(([key, value]) => (
                      <label key={key} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => updatePreferences('inApp', key, e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 capitalize">{key}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Email Notifications */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center space-x-2">
                    <Mail className="w-5 h-5" />
                    <span>Email Notifications</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {Object.entries(preferences.email).filter(([key]) => key !== 'digest').map(([key, value]) => (
                      <label key={key} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={value as boolean}
                          onChange={(e) => updatePreferences('email', key, e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 capitalize">{key}</span>
                      </label>
                    ))}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Digest Frequency</label>
                    <select
                      value={preferences.email.digest}
                      onChange={(e) => updatePreferences('email', 'digest', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="immediate">Immediate</option>
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </div>
                </div>

                {/* SMS Notifications */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center space-x-2">
                    <Smartphone className="w-5 h-5" />
                    <span>SMS Alerts</span>
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(preferences.sms).filter(([key]) => key !== 'threshold').map(([key, value]) => (
                      <label key={key} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={value as boolean}
                          onChange={(e) => updatePreferences('sms', key, e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      </label>
                    ))}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SMS Alert Threshold (Invoice Amount)
                      </label>
                      <input
                        type="number"
                        value={preferences.sms.threshold}
                        onChange={(e) => updatePreferences('sms', 'threshold', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="10000"
                      />
                    </div>
                  </div>
                </div>

                {/* Other Settings */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Other Settings</h3>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={preferences.sound}
                        onChange={(e) => updatePreferences('sound', '', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <Volume2 className="w-4 h-4" />
                      <span className="text-sm text-gray-700">Play notification sounds</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={preferences.desktop}
                        onChange={(e) => updatePreferences('desktop', '', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <Bell className="w-4 h-4" />
                      <span className="text-sm text-gray-700">Show desktop notifications</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowPreferences(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Preferences
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default NotificationSystem 