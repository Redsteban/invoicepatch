import { NextRequest, NextResponse } from 'next/server';

interface ReconciliationRequest {
  action: 'match_invoices' | 'validate_rates' | 'detect_exceptions' | 'bulk_approve' | 'analytics';
  invoiceIds?: string[];
  contractorId?: string;
  projectCode?: string;
  timeRange?: '7d' | '30d' | '90d';
}

interface ReconciliationMatch {
  invoiceId: string;
  workOrderId?: string;
  matchConfidence: number;
  matchType: 'exact' | 'fuzzy_name' | 'partial' | 'none';
  exceptions: ReconciliationException[];
  autoApproved: boolean;
  suggestedActions: string[];
}

interface ReconciliationException {
  type: 'rate_mismatch' | 'missing_work_order' | 'date_discrepancy' | 'unauthorized_project' | 'budget_overage' | 'name_variation';
  severity: 'low' | 'medium' | 'high';
  description: string;
  suggestedAction: string;
  autoFixable: boolean;
  currentValue: string;
  expectedValue?: string;
}

interface FuzzyMatchResult {
  contractor: string;
  extractedName: string;
  similarity: number;
  matchType: 'exact' | 'fuzzy_name' | 'none';
  variations: string[];
}

// Simulate fuzzy matching algorithm for contractor names
function fuzzyMatch(extracted: string, approved: string): FuzzyMatchResult {
  const extractedClean = extracted.toLowerCase().replace(/[^\w\s]/g, '');
  const approvedClean = approved.toLowerCase().replace(/[^\w\s]/g, '');
  
  // Exact match
  if (extractedClean === approvedClean) {
    return {
      contractor: approved,
      extractedName: extracted,
      similarity: 100,
      matchType: 'exact',
      variations: []
    };
  }

  // Calculate similarity (simplified Levenshtein-like)
  const similarity = calculateSimilarity(extractedClean, approvedClean);
  
  if (similarity >= 80) {
    return {
      contractor: approved,
      extractedName: extracted,
      similarity,
      matchType: 'fuzzy_name',
      variations: generateVariations(approved)
    };
  }

  return {
    contractor: approved,
    extractedName: extracted,
    similarity,
    matchType: 'none',
    variations: []
  };
}

function calculateSimilarity(str1: string, str2: string): number {
  const words1 = str1.split(' ');
  const words2 = str2.split(' ');
  
  let matches = 0;
  const maxWords = Math.max(words1.length, words2.length);
  
  words1.forEach(word1 => {
    if (words2.some(word2 => word2.includes(word1) || word1.includes(word2))) {
      matches++;
    }
  });
  
  return Math.round((matches / maxWords) * 100);
}

function generateVariations(name: string): string[] {
  return [
    name.replace('Ltd.', 'Limited'),
    name.replace('Limited', 'Ltd.'),
    name.replace('Contracting', 'Contractors'),
    name.replace('&', 'and'),
    name.split(' ').slice(0, 2).join(' ') // First two words only
  ];
}

// Simulate rate validation against approved work orders
function validateRates(invoiceAmount: number, workOrderRates: any): ReconciliationException[] {
  const exceptions: ReconciliationException[] = [];
  const dailyRate = 850; // Simulated approved daily rate
  const estimatedDays = Math.round(invoiceAmount / dailyRate);
  const expectedAmount = dailyRate * estimatedDays;
  const variance = Math.abs(invoiceAmount - expectedAmount) / expectedAmount;

  if (variance > 0.10) { // More than 10% variance
    exceptions.push({
      type: 'rate_mismatch',
      severity: variance > 0.25 ? 'high' : 'medium',
      description: `Invoice amount ${invoiceAmount} varies ${Math.round(variance * 100)}% from expected rate`,
      suggestedAction: 'Review daily rate calculation and work period',
      autoFixable: false,
      currentValue: `$${invoiceAmount}`,
      expectedValue: `$${expectedAmount} (${estimatedDays} days × $${dailyRate})`
    });
  }

  return exceptions;
}

// Simulate intelligent exception detection
function detectExceptions(invoice: any): ReconciliationException[] {
  const exceptions: ReconciliationException[] = [];

  // Budget validation
  const projectBudget = 15000; // Simulated project budget
  const budgetUsed = 8500; // Simulated used budget
  const budgetRemaining = projectBudget - budgetUsed;
  
  if (invoice.amount > budgetRemaining) {
    exceptions.push({
      type: 'budget_overage',
      severity: 'high',
      description: `Invoice would exceed project budget by $${invoice.amount - budgetRemaining}`,
      suggestedAction: 'Require budget approval or split invoice',
      autoFixable: false,
      currentValue: `$${invoice.amount}`,
      expectedValue: `≤$${budgetRemaining} (remaining budget)`
    });
  }

  // Date validation
  const invoiceDate = new Date(invoice.workPeriod.split(' to ')[0]);
  const projectStartDate = new Date('2024-01-01');
  const projectEndDate = new Date('2024-03-31');

  if (invoiceDate < projectStartDate || invoiceDate > projectEndDate) {
    exceptions.push({
      type: 'date_discrepancy',
      severity: 'medium',
      description: 'Work period falls outside approved project timeline',
      suggestedAction: 'Verify work authorization for dates',
      autoFixable: false,
      currentValue: invoice.workPeriod,
      expectedValue: `${projectStartDate.toISOString().split('T')[0]} to ${projectEndDate.toISOString().split('T')[0]}`
    });
  }

  // Project code validation
  const approvedProjects = ['STACK-AB-2024-Q1', 'DRILL-BC-2024-Q1', 'TEST-SK-2024-Q1'];
  if (!approvedProjects.includes(invoice.projectCode)) {
    exceptions.push({
      type: 'unauthorized_project',
      severity: 'high',
      description: `Project code ${invoice.projectCode} not found in approved projects`,
      suggestedAction: 'Verify project authorization or update project code',
      autoFixable: false,
      currentValue: invoice.projectCode,
      expectedValue: `One of: ${approvedProjects.join(', ')}`
    });
  }

  return exceptions;
}

// Process intelligent reconciliation
function processReconciliation(invoices: any[]): ReconciliationMatch[] {
  const approvedContractors = [
    'John Smith Contracting Ltd.',
    'Mike Johnson Contracting', 
    'Sarah Thompson Ltd.',
    'Arctic Drilling Solutions'
  ];

  return invoices.map(invoice => {
    const fuzzyResults = approvedContractors.map(contractor => 
      fuzzyMatch(invoice.extractedContractor, contractor)
    );
    
    const bestMatch = fuzzyResults.reduce((best, current) => 
      current.similarity > best.similarity ? current : best
    );

    const rateExceptions = validateRates(invoice.amount, {});
    const businessExceptions = detectExceptions(invoice);
    const allExceptions = [...rateExceptions, ...businessExceptions];

    // Add name variation exception if fuzzy match
    if (bestMatch.matchType === 'fuzzy_name' && bestMatch.similarity < 95) {
      allExceptions.unshift({
        type: 'name_variation',
        severity: 'low',
        description: `Contractor name variation detected: "${invoice.extractedContractor}" vs "${bestMatch.contractor}"`,
        suggestedAction: `Auto-match to ${bestMatch.contractor}`,
        autoFixable: true,
        currentValue: invoice.extractedContractor,
        expectedValue: bestMatch.contractor
      });
    }

    const matchConfidence = bestMatch.similarity * (1 - (allExceptions.length * 0.1));
    const autoApproved = matchConfidence >= 85 && allExceptions.every(e => e.severity === 'low');

    return {
      invoiceId: invoice.id,
      workOrderId: matchConfidence > 70 ? `WO-${invoice.projectCode.split('-')[0]}-001` : undefined,
      matchConfidence: Math.round(matchConfidence),
      matchType: bestMatch.matchType,
      exceptions: allExceptions,
      autoApproved,
      suggestedActions: generateSuggestedActions(allExceptions, autoApproved)
    };
  });
}

function generateSuggestedActions(exceptions: ReconciliationException[], autoApproved: boolean): string[] {
  if (autoApproved) {
    return ['Auto-approve for payment processing'];
  }

  const actions: string[] = [];
  const highSeverity = exceptions.filter(e => e.severity === 'high');
  const autoFixable = exceptions.filter(e => e.autoFixable);

  if (autoFixable.length > 0) {
    actions.push(`Auto-fix ${autoFixable.length} minor issues`);
  }

  if (highSeverity.length > 0) {
    actions.push('Require manual review for high-severity exceptions');
  } else {
    actions.push('Queue for quick manager approval');
  }

  return actions;
}

export async function POST(request: NextRequest) {
  try {
    const body: ReconciliationRequest = await request.json();
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    switch (body.action) {
      case 'match_invoices': {
        // Mock invoice data for demonstration
        const mockInvoices = [
          {
            id: 'inv-001',
            extractedContractor: 'J. Smith Contracting',
            amount: 4675,
            projectCode: 'STACK-AB-2024-Q1',
            workPeriod: '2024-01-08 to 2024-01-12'
          },
          {
            id: 'inv-002', 
            extractedContractor: 'Mike Johnson Contracting',
            amount: 6750,
            projectCode: 'STACK-AB-2024-Q1',
            workPeriod: '2024-01-15 to 2024-01-19'
          }
        ];

        const matches = processReconciliation(mockInvoices);
        
        return NextResponse.json({
          success: true,
          matches,
          summary: {
            totalProcessed: matches.length,
            autoApproved: matches.filter(m => m.autoApproved).length,
            requiresReview: matches.filter(m => !m.autoApproved).length,
            avgConfidence: Math.round(matches.reduce((sum, m) => sum + m.matchConfidence, 0) / matches.length)
          }
        });
      }

      case 'analytics': {
        const timeRange = body.timeRange || '30d';
        
        return NextResponse.json({
          success: true,
          analytics: {
            timeRange,
            processingMetrics: {
              totalInvoices: timeRange === '7d' ? 104 : timeRange === '30d' ? 452 : 1387,
              autoMatchRate: 94.7,
              avgProcessingTime: 41.3,
              errorRate: 2.3
            },
            timeSavings: {
              hoursTraditional: timeRange === '7d' ? 42 : timeRange === '30d' ? 186 : 567,
              hoursAutomated: timeRange === '7d' ? 8.4 : timeRange === '30d' ? 37.2 : 113.4,
              percentImprovement: 80
            },
            exceptions: {
              rateDiscrepancies: 12,
              nameVariations: 8,
              budgetOverages: 3,
              unauthorized: 2,
              autoFixed: 15
            }
          }
        });
      }

      case 'bulk_approve': {
        const invoiceIds = body.invoiceIds || [];
        
        return NextResponse.json({
          success: true,
          approved: invoiceIds.length,
          processingTime: invoiceIds.length * 2.3, // seconds
          message: `Successfully approved ${invoiceIds.length} invoices for payment processing`
        });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Reconciliation API error:', error);
    return NextResponse.json(
      { error: 'Failed to process reconciliation request' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const invoiceId = searchParams.get('invoiceId');
  const action = searchParams.get('action') || 'status';

  if (action === 'status' && invoiceId) {
    // Return reconciliation status for specific invoice
    return NextResponse.json({
      success: true,
      invoice: {
        id: invoiceId,
        status: 'processed',
        matchConfidence: 87.3,
        workOrderMatched: true,
        exceptionsCount: 1,
        autoApproved: false,
        lastProcessed: new Date().toISOString()
      }
    });
  }

  if (action === 'queue') {
    // Return current reconciliation queues
    return NextResponse.json({
      success: true,
      queues: {
        perfectMatches: 0,
        minorIssues: 1,
        majorIssues: 2,
        processing: 0
      },
      totalPending: 3
    });
  }

  return NextResponse.json({
    success: true,
    message: 'Reconciliation API is operational',
    availableActions: ['match_invoices', 'validate_rates', 'detect_exceptions', 'bulk_approve', 'analytics']
  });
} 