'use client'

import React from 'react'
import ManagerLayout from '@/components/ManagerLayout'
import InvoiceMatchingSystem from '@/components/InvoiceMatchingSystem'

export default function InvoiceMatchingPage() {
  return (
    <ManagerLayout>
      <div className="h-full">
        <InvoiceMatchingSystem />
      </div>
    </ManagerLayout>
  )
} 