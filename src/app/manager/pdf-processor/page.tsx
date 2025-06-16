'use client'

import React from 'react'
import ManagerLayout from '@/components/ManagerLayout'
import PDFInvoiceProcessor from '@/components/PDFInvoiceProcessor'

export default function PDFProcessorPage() {
  return (
    <ManagerLayout>
      <div className="h-full">
        <PDFInvoiceProcessor />
      </div>
    </ManagerLayout>
  )
} 