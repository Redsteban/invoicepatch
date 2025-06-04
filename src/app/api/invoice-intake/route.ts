import { NextRequest, NextResponse } from 'next/server';

interface IntakeRequest {
  method: 'email' | 'pdf' | 'batch' | 'photo' | 'contractor';
  fileName?: string;
  fileContent?: string;
  extractedData?: any;
  contractor?: string;
  projectCode?: string;
}

interface ProcessingResult {
  id: string;
  status: 'processing' | 'completed' | 'error' | 'review_required';
  confidence: number;
  extractedData: ExtractedField[];
  processingTime: number;
  reviewFlags: string[];
}

interface ExtractedField {
  field: string;
  value: string;
  confidence: number;
  source: 'ocr' | 'ai' | 'pattern';
  needsReview: boolean;
  suggestedValue?: string;
}

// Simulate OCR and AI processing
function simulateInvoiceProcessing(request: IntakeRequest): ProcessingResult {
  const processingId = `proc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Simulate different processing outcomes based on method
  const baseConfidence = {
    'email': 94.2,
    'pdf': 96.8,
    'batch': 98.5,
    'photo': 78.9,
    'contractor': 99.1
  }[request.method] || 85.0;

  // Simulate realistic extracted data with varying confidence levels
  const extractedFields: ExtractedField[] = [
    {
      field: 'Invoice Number',
      value: request.method === 'photo' ? 'ST-2024-O01' : 'ST-2024-001',
      confidence: request.method === 'photo' ? 87.3 : 98.5,
      source: 'ocr',
      needsReview: request.method === 'photo',
      suggestedValue: request.method === 'photo' ? 'ST-2024-001' : undefined
    },
    {
      field: 'Contractor Name',
      value: request.contractor || 'Stack Testing Contractor Ltd.',
      confidence: 96.2,
      source: 'ocr',
      needsReview: false
    },
    {
      field: 'Invoice Date',
      value: new Date().toISOString().split('T')[0],
      confidence: 94.8,
      source: 'pattern',
      needsReview: false
    },
    {
      field: 'Amount',
      value: request.method === 'photo' ? '$1,B47.50' : '$1,847.50',
      confidence: request.method === 'photo' ? 73.4 : 99.1,
      source: 'ocr',
      needsReview: request.method === 'photo',
      suggestedValue: request.method === 'photo' ? '$1,847.50' : undefined
    },
    {
      field: 'Project Code',
      value: request.projectCode || 'STACK-AB-2024-Q1',
      confidence: 91.3,
      source: 'ai',
      needsReview: false
    },
    {
      field: 'Work Period',
      value: '2024-01-08 to 2024-01-12',
      confidence: 88.7,
      source: 'ai',
      needsReview: baseConfidence < 85
    },
    {
      field: 'GST Amount',
      value: '$92.38',
      confidence: 97.4,
      source: 'pattern',
      needsReview: false
    },
    {
      field: 'Total Amount',
      value: '$1,939.88',
      confidence: 99.3,
      source: 'ocr',
      needsReview: false
    }
  ];

  // Determine if manual review is required
  const lowConfidenceFields = extractedFields.filter(field => field.confidence < 85);
  const requiresReview = lowConfidenceFields.length > 0 || baseConfidence < 85;

  const reviewFlags: string[] = [];
  if (requiresReview) {
    reviewFlags.push('Low OCR confidence detected');
    if (request.method === 'photo') {
      reviewFlags.push('Mobile photo quality may affect accuracy');
    }
    if (lowConfidenceFields.length > 0) {
      reviewFlags.push(`${lowConfidenceFields.length} fields need manual verification`);
    }
  }

  return {
    id: processingId,
    status: requiresReview ? 'review_required' : 'completed',
    confidence: baseConfidence,
    extractedData: extractedFields,
    processingTime: Math.round((Math.random() * 30 + 15) * 100) / 100, // 15-45 seconds
    reviewFlags
  };
}

// Simulate work order matching
function simulateWorkOrderMatching(extractedData: ExtractedField[]) {
  const projectCode = extractedData.find(field => field.field === 'Project Code')?.value;
  const contractor = extractedData.find(field => field.field === 'Contractor Name')?.value;
  
  return {
    matchFound: true,
    matchConfidence: 94.7,
    workOrderId: 'WO-STACK-AB-2024-001',
    projectDetails: {
      projectName: 'Stack Testing - Alberta Q1 2024',
      location: 'Grande Prairie, AB',
      dailyRate: 850,
      equipmentRate: 150,
      expectedDays: 5
    },
    potentialIssues: []
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: IntakeRequest = await request.json();
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Process the invoice
    const processingResult = simulateInvoiceProcessing(body);
    
    // Attempt work order matching
    const workOrderMatch = simulateWorkOrderMatching(processingResult.extractedData);
    
    return NextResponse.json({
      success: true,
      processing: processingResult,
      workOrderMatch,
      timestamp: new Date().toISOString(),
      processingMethod: body.method
    });
    
  } catch (error) {
    console.error('Invoice processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process invoice intake request' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const processingId = searchParams.get('id');
  
  if (!processingId) {
    return NextResponse.json(
      { error: 'Processing ID required' },
      { status: 400 }
    );
  }
  
  // Simulate retrieving processing status
  const mockStatus = {
    id: processingId,
    status: 'completed',
    confidence: 94.2,
    processingTime: 38.5,
    extractedFields: 8,
    reviewRequired: false,
    workOrderMatched: true,
    readyForApproval: true
  };
  
  return NextResponse.json({
    success: true,
    processing: mockStatus,
    timestamp: new Date().toISOString()
  });
} 