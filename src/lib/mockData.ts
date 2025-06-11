export const generateContractorInvoices = (count: number = 30) => {
  const contractors = [
    'John Smith', 'Sarah Chen', 'Mike Johnson', 'Lisa Wong', 'David Brown',
    'Emma Wilson', 'Tom Davis', 'Amy Lee', 'Chris Martin', 'Jessica Taylor'
  ]
  
  const projects = [
    'Calgary Downtown', 'Edmonton North', 'Red Deer Site A', 'Fort Mac Project',
    'Lethbridge Industrial', 'Medicine Hat Complex'
  ]
  
  const invoices = []
  
  for (let i = 0; i < count; i++) {
    const isMatched = Math.random() > 0.2 // 80% match rate
    const confidence = isMatched ? Math.floor(Math.random() * 15) + 85 : Math.floor(Math.random() * 30) + 50
    
    invoices.push({
      id: `INV-2025-${String(i + 1).padStart(4, '0')}`,
      contractor: contractors[Math.floor(Math.random() * contractors.length)],
      project: projects[Math.floor(Math.random() * projects.length)],
      amount: Math.floor(Math.random() * 5000) + 1500,
      submittedDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: confidence > 85 ? 'matched' : 'flagged',
      confidence,
      issues: confidence <= 85 ? ['Rate mismatch', 'Missing work order', 'Date discrepancy'][Math.floor(Math.random() * 3)] : null,
      workOrderMatch: isMatched ? `WO-${String(Math.floor(Math.random() * 1000) + 1).padStart(4, '0')}` : null
    })
  }
  
  return invoices
}

export const calculateStats = (invoices: any[]) => {
  const pending = invoices.filter(inv => inv.status === 'matched' && !inv.processed)
  const reconciled = invoices.filter(inv => inv.processed)
  const flagged = invoices.filter(inv => inv.status === 'flagged')
  
  return {
    pending: pending.length,
    pendingAmount: pending.reduce((sum, inv) => sum + inv.amount, 0),
    reconciled: reconciled.length,
    reconciledAmount: reconciled.reduce((sum, inv) => sum + inv.amount, 0),
    flagged: flagged.length,
    flaggedAmount: flagged.reduce((sum, inv) => sum + inv.amount, 0),
    totalSaved: reconciled.length * 0.4 // 24 minutes saved per invoice
  }
} 