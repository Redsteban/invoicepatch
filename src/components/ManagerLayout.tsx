'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bell, 
  LogOut, 
  FileText, 
  CheckCircle, 
  BarChart3,
  Settings,
  Upload,
  Download,
  Search,
  Menu,
  X,
  ChevronRight,
  Home,
  Mail,
  Database,
  Target,
  FolderUp,
  AlertTriangle,
  UserCheck,
  PieChart,
  TrendingUp
} from 'lucide-react'
import NotificationSystem from './NotificationSystem'
import GuidedTour from './GuidedTour'

interface ManagerLayoutProps {
  children: React.ReactNode
  currentPage?: string
  loading?: boolean
}

interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

const ManagerLayout: React.FC<ManagerLayoutProps> = ({ 
  children, 
  currentPage = 'Dashboard',
  loading = false 
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isNavigating, setIsNavigating] = useState(false)

  // Update active tab based on pathname
  useEffect(() => {
    const path = pathname.split('/').pop()
    setActiveTab(path || 'dashboard')
  }, [pathname])

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = sessionStorage.getItem('manager_authenticated')
      if (!isAuthenticated) {
        router.push('/manager/login')
      }
    }
    checkAuth()
  }, [router])

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, href: '/manager/dashboard', badge: null },
    { id: 'email-inbox', label: 'Email Inbox', icon: Mail, href: '/manager/email-inbox', badge: 12 },
    { id: 'pdf-processor', label: 'PDF Processor', icon: Upload, href: '/manager/pdf-processor', badge: null },
    { id: 'billing-integration', label: 'Billing Integration', icon: Database, href: '/manager/billing-integration', badge: null },
    { id: 'invoice-matching', label: 'Invoice Matching', icon: Target, href: '/manager/invoice-matching', badge: 8 },
    { id: 'manual-upload', label: 'Manual Upload', icon: FolderUp, href: '/manager/manual-upload', badge: null },
    { id: 'issue-detection', label: 'Issue Detection', icon: AlertTriangle, href: '/manager/issue-detection', badge: 6 },
    { id: 'approval-workflow', label: 'Approval Workflow', icon: UserCheck, href: '/manager/approval-workflow', badge: 12 },
    { id: 'reporting', label: 'Reporting', icon: PieChart, href: '/manager/reporting', badge: null },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, href: '/manager/analytics', badge: null },
    { id: 'process', label: 'Process Invoices', icon: FileText, href: '/manager/process', badge: 17 },
    { id: 'reconciliation', label: 'Reconciliation', icon: CheckCircle, href: '/manager/reconciliation', badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/manager/settings', badge: null },
  ]

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Dashboard', href: '/manager/dashboard' }
    ]

    if (pathSegments.length > 2) {
      const pageName = pathSegments[2]
      const pageConfig = {
        'email-inbox': 'Email Inbox',
        'pdf-processor': 'PDF Processor',
        'billing-integration': 'Billing Integration',
        'invoice-matching': 'Invoice Matching',
        'manual-upload': 'Manual Upload',
        'issue-detection': 'Issue Detection',
        'approval-workflow': 'Approval Workflow',
        reporting: 'Reporting & Analytics',
        analytics: 'Analytics Dashboard',
        process: 'Process Invoices',
        reconciliation: 'Reconciliation',
        settings: 'Settings'
      }
      
      if (pageName in pageConfig) {
        breadcrumbs.push({
          label: pageConfig[pageName as keyof typeof pageConfig],
          current: true
        })
      }
    }

    return breadcrumbs
  }

  const handleNavigation = async (item: typeof sidebarItems[0]) => {
    if (item.href === pathname) return
    
    setIsNavigating(true)
    
    // Add a small delay for smooth transition
    await new Promise(resolve => setTimeout(resolve, 100))
    
    router.push(item.href)
    
    // Reset loading state after navigation
    setTimeout(() => setIsNavigating(false), 300)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('manager_authenticated')
    router.push('/manager/login')
  }

  const breadcrumbs = getBreadcrumbs()

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Always Present Sidebar */}
      <div 
        data-tour="sidebar"
        className={`
          bg-white shadow-xl border-r border-gray-200 flex-shrink-0 z-40 transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? 'w-16' : 'w-64'}
        `}
      >
        <div className="flex items-center justify-between h-20 px-6 border-b border-gray-200">
          {!sidebarCollapsed && <h2 className="text-xl font-bold text-gray-900">InvoicePatch</h2>}
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
        
        <nav className={`p-4 space-y-2 ${sidebarCollapsed ? 'px-2' : 'px-6'}`}>
          {sidebarItems.map((item) => (
            <motion.button
              key={item.id}
              data-tour={item.id}
              onClick={() => handleNavigation(item)}
              className={`
                w-full flex items-center text-left rounded-xl transition-all duration-200 relative
                ${sidebarCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3'}
                ${activeTab === item.id 
                  ? 'bg-black text-white shadow-lg' 
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isNavigating}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <item.icon className={`w-5 h-5 ${sidebarCollapsed ? '' : 'mr-3'} flex-shrink-0`} />
              {!sidebarCollapsed && (
                <>
                  <span className="flex-1 font-medium">{item.label}</span>
                  {item.badge && (
                    <motion.span 
                      className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      {item.badge}
                    </motion.span>
                  )}
                </>
              )}
              {sidebarCollapsed && item.badge && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {item.badge > 99 ? '99+' : item.badge}
                </div>
              )}
            </motion.button>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className={`absolute bottom-0 left-0 right-0 border-t border-gray-200 ${sidebarCollapsed ? 'p-2' : 'p-6'}`}>
          {!sidebarCollapsed && (
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">JD</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">John Doe</p>
                <p className="text-xs text-gray-600">Manager</p>
              </div>
            </div>
          )}
          <button 
            onClick={handleLogout}
            className={`
              w-full flex items-center text-gray-700 hover:bg-gray-100 rounded-lg transition-colors
              ${sidebarCollapsed ? 'p-3 justify-center' : 'px-4 py-2'}
            `}
            title={sidebarCollapsed ? 'Sign Out' : undefined}
          >
            <LogOut className={`w-4 h-4 ${sidebarCollapsed ? '' : 'mr-3'}`} />
            {!sidebarCollapsed && <span className="text-sm">Sign Out</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 relative z-10">
          <div className="flex items-center justify-between h-20 px-8">
            <div className="flex items-center space-x-6">
              {/* Breadcrumbs */}
              <nav className="flex items-center space-x-2 text-sm">
                <Home className="w-4 h-4 text-gray-400" />
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={index}>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    {crumb.current ? (
                      <span className="font-medium text-gray-900">{crumb.label}</span>
                    ) : (
                      <button
                        onClick={() => crumb.href && router.push(crumb.href)}
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        {crumb.label}
                      </button>
                    )}
                  </React.Fragment>
                ))}
              </nav>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search invoices..."
                  className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent w-72"
                />
              </div>
              
              {/* Notifications */}
              <div data-tour="notifications">
                <NotificationSystem />
              </div>
            </div>
          </div>

          {/* Loading Bar */}
          <AnimatePresence>
            {(loading || isNavigating) && (
              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-black"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                exit={{ width: '100%', opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </AnimatePresence>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Guided Tour System */}
      <GuidedTour />
    </div>
  )
}

export default ManagerLayout 