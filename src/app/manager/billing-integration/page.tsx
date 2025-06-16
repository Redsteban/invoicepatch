'use client'

import React from 'react'
import ManagerLayout from '@/components/ManagerLayout'
import BillingIntegrationInterface from '@/components/BillingIntegrationInterface'

export default function BillingIntegrationPage() {
  return (
    <ManagerLayout>
      <div className="h-full">
        <BillingIntegrationInterface />
      </div>
    </ManagerLayout>
  )
} 