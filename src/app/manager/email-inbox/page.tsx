'use client'

import React, { useState } from 'react'
import ManagerLayout from '@/components/ManagerLayout'
import EmailInboxInterface from '@/components/EmailInboxInterface'

interface EmailMessage {
  id: string
  sender: string
  subject: string
  hasInvoice: boolean
  invoiceAmount?: number
}

export default function EmailInboxPage() {
  const [importedEmails, setImportedEmails] = useState<EmailMessage[]>([])

  const handleImportSelected = (emails: EmailMessage[]) => {
    setImportedEmails(emails)
    // Here you would typically send the emails to your backend
    console.log('Importing emails:', emails)
    
    // Show success message
    alert(`Successfully imported ${emails.length} emails for processing`)
  }

  return (
    <ManagerLayout>
      <div className="h-full">
        <EmailInboxInterface onImportSelected={handleImportSelected} />
      </div>
    </ManagerLayout>
  )
} 