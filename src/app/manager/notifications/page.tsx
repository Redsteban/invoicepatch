import ManagerLayout from '@/components/ManagerLayout'

export default function NotificationsPage() {
  return (
    <ManagerLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">All Notifications</h1>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-gray-600">Comprehensive notification management interface</p>
        </div>
      </div>
    </ManagerLayout>
  )
} 