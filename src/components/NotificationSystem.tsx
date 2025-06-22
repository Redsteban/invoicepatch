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
  VolumeX,
  Drill,
  Fuel,
  Shield
} from 'lucide-react'

interface Notification {
  id: string
  type: 'system' | 'approval' | 'issue' | 'report' | 'ticket' | 'operator' | 'compliance'
  priority: 'low' | 'medium' | 'high' | 'urgent' | 'safety-alert'
  title: string
  message: string
  timestamp: Date
  read: boolean
  archived: boolean
  actionUrl?: string
  actionLabel?: string
  metadata?: {
    ticketId?: string
    operatorId?: string
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
    tickets: boolean
    operators: boolean
  }
  email: {
    system: boolean
    approvals: boolean
    issues: boolean
    reports: boolean
    tickets: boolean
    operators: boolean
    digest: 'immediate' | 'hourly' | 'daily' | 'weekly'
  }
  sms: {
    urgent: boolean
    criticalIssues: boolean
    highValueTickets: boolean
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
      tickets: true,
      operators: true
    },
    email: {
      system: true,
      approvals: true,
      issues: true,
      reports: false,
      tickets: true,
      operators: false,
      digest: 'daily'
    },
    sms: {
      urgent: true,
      criticalIssues: true,
      highValueTickets: true,
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
      message: 'Field ticket processing failed for operator "Rig Runners" - immediate attention required.',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      archived: false,
      actionUrl: '/manager/issue-detection',
      actionLabel: 'View Issue',
      metadata: { operatorId: 'rig-runners', ticketId: 'FT-2024-001' }
    },
    {
      id: '2',
      type: 'approval',
      priority: 'high',
      title: 'High-Value Ticket Pending',
      message: 'Field Ticket for $25,000 from "Apex Drilling" requires your approval.',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      read: false,
      archived: false,
      actionUrl: '/manager/approval-workflow',
      actionLabel: 'Review',
      metadata: { amount: 25000, operatorId: 'apex-drilling', ticketId: 'FT-2024-002' }
    },
    {
      id: '6',
      type: 'compliance',
      priority: 'safety-alert',
      title: 'Safety Alert: Certification Expired',
      message: 'John Doe from "Apex Drilling" has an expired H2S Alive certification.',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      read: false,
      archived: false,
      actionUrl: '/manager/compliance',
      actionLabel: 'View Compliance',
      metadata: { operatorId: 'apex-drilling' }
    },
    {
      id: '3',
      type: 'system',
      priority: 'medium',
      title: 'System Maintenance Scheduled',
      message: 'Scheduled maintenance window: Tomorrow 2:00 AM - 4:00 AM MST.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true,
      archived: false
    },
    {
      id: '4',
      type: 'report',
      priority: 'low',
      title: 'Monthly Operations Report',
      message: 'Your monthly field operations report is ready for review.',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      read: true,
      archived: false,
      actionUrl: '/manager/reporting',
      actionLabel: 'View Report'
    },
    {
      id: '5',
      type: 'operator',
      priority: 'medium',
      title: 'New Sub-Contractor Onboarded',
      message: '"Horizon Wells" has been successfully onboarded.',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      read: false,
      archived: false,
      metadata: { operatorId: 'horizon-wells' }
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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const playNotificationSound = () => {
    // Implement sound playback logic here, e.g., using new Audio()
    // For now, let's just log it
    console.log('Playing notification sound...')
  }

  const getUnreadCount = () => {
    return notifications.filter(n => !n.read && !n.archived).length
  }

  const getFilteredNotifications = () => {
    return notifications
      .filter(n => {
        if (activeTab === 'unread') return !n.read && !n.archived
        if (activeTab === 'archived') return n.archived
        return !n.archived
      })
      .filter(n => selectedCategory === 'all' || n.type === selectedCategory)
      .filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.message.toLowerCase().includes(searchQuery.toLowerCase()))
  }

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const markAsUnread = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: false } : n))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const archiveNotification = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, archived: true } : n))
  }
  
  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const getPriorityInfo = (priority: Notification['priority']) => {
    switch (priority) {
      case 'safety-alert':
        return { color: 'bg-red-500', textColor: 'text-red-800', bgColor: 'bg-red-100', icon: <Shield /> }
      case 'urgent':
        return { color: 'bg-red-500', textColor: 'text-red-800', bgColor: 'bg-red-100', icon: <AlertTriangle /> }
      case 'high':
        return { color: 'bg-orange-500', textColor: 'text-orange-800', bgColor: 'bg-orange-100', icon: <Info /> }
      case 'medium':
        return { color: 'bg-blue-500', textColor: 'text-blue-800', bgColor: 'bg-blue-100', icon: <Info /> }
      default:
        return { color: 'bg-gray-400', textColor: 'text-gray-800', bgColor: 'bg-gray-100', icon: <Info /> }
    }
  }

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'system': return <Settings className="w-5 h-5" />
      case 'approval': return <UserCheck className="w-5 h-5" />
      case 'issue': return <AlertTriangle className="w-5 h-5" />
      case 'report': return <FileText className="w-5 h-5" />
      case 'ticket': return <FileText className="w-5 h-5" />
      case 'operator': return <Drill className="w-5 h-5" />
      case 'compliance': return <Shield className="w-5 h-5" />
      default: return <Bell className="w-5 h-5" />
    }
  }
  
  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return timestamp.toLocaleDateString();
  };

  const updatePreferences = (section: keyof NotificationPreferences, key: string, value: any) => {
    setPreferences(prev => {
      const newPrefs = { ...prev };
      (newPrefs[section] as any)[key] = value;
      return newPrefs;
    });
  };

  const filteredNotifications = getFilteredNotifications()
  const unreadCount = getUnreadCount()

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="relative p-2 rounded-full hover:bg-gray-200 text-gray-600 transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-[28rem] origin-top-right rounded-xl shadow-2xl bg-white border border-gray-200 overflow-hidden"
            style={{ zIndex: 50 }}
          >
            <div className="flex flex-col h-[70vh]">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">Notifications</h3>
                <div className="flex items-center space-x-2">
                  <button onClick={() => setShowPreferences(!showPreferences)} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                    <Settings className="w-5 h-5" />
                  </button>
                  <button onClick={() => setIsOpen(false)} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {showPreferences ? (
                // Preferences View
                <div className="flex-grow p-4 overflow-y-auto">
                   <h4 className="text-lg font-semibold mb-4 text-gray-800">Notification Settings</h4>
                  
                  {/* In-App Notifications */}
                  <div className="mb-6">
                    <h5 className="font-semibold mb-2 text-gray-700">In-App Alerts</h5>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {Object.entries(preferences.inApp).map(([key, value]) => (
                        <label key={key} className="flex items-center space-x-2">
                          <input type="checkbox" checked={value} onChange={(e) => updatePreferences('inApp', key, e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                          <span className="text-gray-600 capitalize">{key}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Email Notifications */}
                  <div className="mb-6">
                    <h5 className="font-semibold mb-2 text-gray-700">Email Notifications</h5>
                    <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                       {Object.entries(preferences.email).filter(([k]) => k !== 'digest').map(([key, value]) => (
                        <label key={key} className="flex items-center space-x-2">
                          <input type="checkbox" checked={value as boolean} onChange={(e) => updatePreferences('email', key, e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                          <span className="text-gray-600 capitalize">{key}</span>
                        </label>
                      ))}
                    </div>
                    <select value={preferences.email.digest} onChange={(e) => updatePreferences('email', 'digest', e.target.value)} className="w-full p-2 text-sm border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500">
                      <option value="immediate">Immediate</option>
                      <option value="hourly">Hourly Digest</option>
                      <option value="daily">Daily Digest</option>
                      <option value="weekly">Weekly Digest</option>
                    </select>
                  </div>

                  {/* SMS Notifications */}
                  <div className="mb-6">
                    <h5 className="font-semibold mb-2 text-gray-700">SMS Alerts</h5>
                     <div className="space-y-2 text-sm">
                       {Object.entries(preferences.sms).filter(([k]) => k !== 'threshold').map(([key, value]) => (
                        <label key={key} className="flex items-center space-x-2">
                          <input type="checkbox" checked={value as boolean} onChange={(e) => updatePreferences('sms', key, e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                          <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        </label>
                      ))}
                      <div className="flex items-center space-x-2">
                          <input type="checkbox" checked={preferences.sms.highValueTickets} onChange={(e) => updatePreferences('sms', 'highValueTickets', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                          <span className="text-gray-600">High Value Tickets over $</span>
                          <input type="number" value={preferences.sms.threshold} onChange={(e) => updatePreferences('sms', 'threshold', parseInt(e.target.value))} className="w-24 p-1 text-sm border-gray-300 rounded-md"/>
                      </div>
                    </div>
                  </div>

                  {/* General Settings */}
                  <div>
                    <h5 className="font-semibold mb-2 text-gray-700">General</h5>
                    <div className="flex flex-col space-y-2 text-sm">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" checked={preferences.sound} onChange={(e) => updatePreferences('sound', '', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                        <span className="text-gray-600">Notification Sound</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" checked={preferences.desktop} onChange={(e) => updatePreferences('desktop', '', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                        <span className="text-gray-600">Desktop Notifications</span>
                      </label>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Tabs */}
                  <div className="flex border-b border-gray-200 px-2">
                    {['all', 'unread', 'archived'].map(tab => (
                      <button 
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-4 py-2 text-sm font-semibold transition-colors ${activeTab === tab ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-800'}`}
                      >
                        <span className="capitalize">{tab}</span>
                        {tab === 'unread' && <span className="ml-2 bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">{unreadCount}</span>}
                      </button>
                    ))}
                  </div>

                  {/* Filters and Search */}
                  <div className="p-3 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                      <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                          type="text" 
                          placeholder="Search notifications..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-sm bg-gray-100 border border-gray-200 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      <select 
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="p-2 text-sm bg-gray-100 border-gray-200 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="all">All Types</option>
                        <option value="system">System</option>
                        <option value="approval">Approvals</option>
                        <option value="issue">Issues</option>
                        <option value="report">Reports</option>
                        <option value="compliance">Compliance</option>
                      </select>
                    </div>
                  </div>

                  {/* Notification List */}
                  <div className="flex-grow overflow-y-auto">
                    {filteredNotifications.length > 0 ? (
                      <ul>
                        {filteredNotifications.map(notification => {
                          const priorityInfo = getPriorityInfo(notification.priority)
                          return (
                            <li 
                              key={notification.id} 
                              className={`p-4 border-l-4 transition-colors ${
                                notification.read ? 'bg-white' : 'bg-green-50'
                              } hover:bg-gray-100`}
                              style={{borderColor: priorityInfo.color}}
                            >
                              <div className="flex items-start space-x-3">
                                <div className={`mt-1 p-1.5 rounded-full ${priorityInfo.bgColor}`}>
                                  <div className={priorityInfo.textColor}>{getTypeIcon(notification.type)}</div>
                                </div>
                                <div className="flex-grow">
                                  <div className="flex justify-between items-center">
                                    <h4 className="font-semibold text-gray-800 text-sm">{notification.title}</h4>
                                    <span className="text-xs text-gray-500">{formatTimestamp(notification.timestamp)}</span>
                                  </div>
                                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                  <div className="flex items-center justify-between mt-2">
                                    <div className="flex items-center space-x-2">
                                      {notification.actionUrl && (
                                        <a href={notification.actionUrl} className="text-sm font-semibold text-green-600 hover:text-green-700">
                                          {notification.actionLabel || 'View'}
                                        </a>
                                      )}
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      {notification.read ? (
                                        <button title="Mark as unread" onClick={() => markAsUnread(notification.id)} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600"><EyeOff className="w-4 h-4" /></button>
                                      ) : (
                                        <button title="Mark as read" onClick={() => markAsRead(notification.id)} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600"><Eye className="w-4 h-4" /></button>
                                      )}
                                      <button title="Archive" onClick={() => archiveNotification(notification.id)} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600"><Archive className="w-4 h-4" /></button>
                                      <button title="Delete" onClick={() => deleteNotification(notification.id)} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>
                          )
                        })}
                      </ul>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-500">No notifications to display.</p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Footer */}
              {!showPreferences && (
                <div className="p-2 border-t border-gray-200 flex justify-end">
                  <button 
                    onClick={markAllAsRead} 
                    className="text-sm font-semibold text-green-600 hover:text-green-800 px-3 py-1.5 rounded-lg hover:bg-green-50"
                  >
                    Mark All as Read
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default NotificationSystem 