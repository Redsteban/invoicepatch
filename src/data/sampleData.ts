// Sample Data for InvoicePatch System
// Comprehensive dataset for demonstrations and testing

export interface Contractor {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  industry: string;
  specialty: string[];
  rating: number;
  yearsExperience: number;
  certifications: string[];
  preferredPaymentTerms: string;
  taxId: string;
  registrationDate: string;
  totalInvoicesSubmitted: number;
  totalAmountBilled: number;
  averageProcessingTime: number;
  complianceScore: number;
  avatar?: string;
}

export interface Invoice {
  id: string;
  contractorId: string;
  contractorName: string;
  invoiceNumber: string;
  poNumber?: string;
  amount: number;
  submittedAmount?: number; // For discrepancy scenarios
  description: string;
  category: string;
  industry: string;
  dateIssued: string;
  dateDue: string;
  dateSubmitted: string;
  dateProcessed?: string;
  status: 'pending' | 'approved' | 'rejected' | 'processing' | 'paid' | 'disputed';
  fileFormat: string;
  fileName: string;
  lineItems: InvoiceLineItem[];
  notes?: string;
  flags: string[];
  processingTime?: number;
  approvedBy?: string;
  rejectedReason?: string;
  matchConfidence?: number;
  riskScore?: number;
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  category: string;
}

export interface HistoricalData {
  month: string;
  year: number;
  invoicesProcessed: number;
  totalAmount: number;
  averageProcessingTime: number;
  accuracyRate: number;
  costSavings: number;
  contractorCount: number;
}

export interface Testimonial {
  id: string;
  contractorName: string;
  company: string;
  role: string;
  content: string;
  rating: number;
  date: string;
  industry: string;
  featured: boolean;
}

// Contractor Profiles
export const sampleContractors: Contractor[] = [
  {
    id: "CNT-001",
    name: "John Baker",
    company: "Baker Oilfield Services",
    email: "john@bakeroilfield.com",
    phone: "(555) 123-4567",
    address: "1234 Rig Road, Midland, TX 79701",
    industry: "Oil & Gas Services",
    specialty: ["Well Servicing", "Flowback", "Water Hauling"],
    rating: 4.8,
    yearsExperience: 15,
    certifications: ["H2S Alive", "PEC Safeland", "First Aid & CPR"],
    preferredPaymentTerms: "Net 30",
    taxId: "12-3456789",
    registrationDate: "2019-03-15",
    totalInvoicesSubmitted: 234,
    totalAmountBilled: 2450000,
    averageProcessingTime: 2.1,
    complianceScore: 95.2,
    avatar: "/avatars/john-baker.jpg"
  },
  {
    id: "CNT-002",
    name: "Sarah Chen",
    company: "Chen Energy Logistics",
    email: "sarah@chenenergy.com",
    phone: "(555) 234-5678",
    address: "567 Pipeline Ave, Houston, TX 77002",
    industry: "Oil & Gas Logistics",
    specialty: ["Crude Hauling", "Rig Moving", "Equipment Transport"],
    rating: 4.9,
    yearsExperience: 12,
    certifications: ["CDL with Hazmat", "DOT Compliance", "ISNetworld Certified"],
    preferredPaymentTerms: "Net 15",
    taxId: "23-4567890",
    registrationDate: "2020-01-08",
    totalInvoicesSubmitted: 156,
    totalAmountBilled: 890000,
    averageProcessingTime: 1.8,
    complianceScore: 97.8,
    avatar: "/avatars/sarah-chen.jpg"
  },
  {
    id: "CNT-003",
    name: "Mike Rodriguez",
    company: "Rodriguez HVAC Solutions",
    email: "mike@rodriguezhvac.com",
    phone: "(555) 345-6789",
    address: "890 Climate Way, Phoenix, AZ 85001",
    industry: "HVAC",
    specialty: ["Commercial HVAC", "Energy Efficiency", "Maintenance"],
    rating: 4.6,
    yearsExperience: 18,
    certifications: ["EPA 608 Universal", "NATE Certified", "Energy Star Partner"],
    preferredPaymentTerms: "Net 30",
    taxId: "34-5678901",
    registrationDate: "2018-06-22",
    totalInvoicesSubmitted: 189,
    totalAmountBilled: 1230000,
    averageProcessingTime: 2.5,
    complianceScore: 89.3,
    avatar: "/avatars/mike-rodriguez.jpg"
  },
  {
    id: "CNT-004",
    name: "Lisa Thompson",
    company: "Thompson Plumbing Pros",
    email: "lisa@thompsonplumbing.com",
    phone: "(555) 456-7890",
    address: "345 Pipeline Road, Denver, CO 80202",
    industry: "Plumbing",
    specialty: ["Emergency Services", "Pipe Installation", "Water Heaters"],
    rating: 4.7,
    yearsExperience: 10,
    certifications: ["Master Plumber", "Backflow Prevention", "Green Plumber"],
    preferredPaymentTerms: "Net 21",
    taxId: "45-6789012",
    registrationDate: "2021-02-14",
    totalInvoicesSubmitted: 98,
    totalAmountBilled: 456000,
    averageProcessingTime: 1.9,
    complianceScore: 92.1,
    avatar: "/avatars/lisa-thompson.jpg"
  },
  {
    id: "CNT-005",
    name: "David Kim",
    company: "Kim Landscaping & Design",
    email: "david@kimlandscaping.com",
    phone: "(555) 567-8901",
    address: "678 Garden Lane, Seattle, WA 98101",
    industry: "Landscaping",
    specialty: ["Landscape Design", "Irrigation Systems", "Maintenance"],
    rating: 4.5,
    yearsExperience: 8,
    certifications: ["Certified Landscape Professional", "Irrigation Association", "Pesticide License"],
    preferredPaymentTerms: "Net 15",
    taxId: "56-7890123",
    registrationDate: "2022-04-10",
    totalInvoicesSubmitted: 76,
    totalAmountBilled: 234000,
    averageProcessingTime: 2.2,
    complianceScore: 88.7,
    avatar: "/avatars/david-kim.jpg"
  },
  {
    id: "CNT-006",
    name: "Amanda Foster",
    company: "Foster Security Systems",
    email: "amanda@fostersecurity.com",
    phone: "(555) 678-9012",
    address: "123 Safety Street, Miami, FL 33101",
    industry: "Security",
    specialty: ["Access Control", "Surveillance", "Alarm Systems"],
    rating: 4.9,
    yearsExperience: 14,
    certifications: ["NICET Certified", "PSA Licensed", "Low Voltage Specialist"],
    preferredPaymentTerms: "Net 30",
    taxId: "67-8901234",
    registrationDate: "2019-11-03",
    totalInvoicesSubmitted: 145,
    totalAmountBilled: 678000,
    averageProcessingTime: 1.7,
    complianceScore: 96.5,
    avatar: "/avatars/amanda-foster.jpg"
  },
  {
    id: "CNT-007",
    name: "Robert Wilson",
    company: "Wilson Roofing & Repair",
    email: "robert@wilsonroofing.com",
    phone: "(555) 789-0123",
    address: "456 Summit Ave, Atlanta, GA 30301",
    industry: "Roofing",
    specialty: ["Commercial Roofing", "Storm Damage", "Waterproofing"],
    rating: 4.4,
    yearsExperience: 20,
    certifications: ["GAF Master Elite", "OSHA 10", "Storm Damage Specialist"],
    preferredPaymentTerms: "Net 45",
    taxId: "78-9012345",
    registrationDate: "2017-09-18",
    totalInvoicesSubmitted: 267,
    totalAmountBilled: 1890000,
    averageProcessingTime: 3.1,
    complianceScore: 85.9,
    avatar: "/avatars/robert-wilson.jpg"
  },
  {
    id: "CNT-008",
    name: "Jennifer Lee",
    company: "Lee IT Solutions",
    email: "jennifer@leeitsolutions.com",
    phone: "(555) 890-1234",
    address: "789 Tech Plaza, Boston, MA 02101",
    industry: "IT Services",
    specialty: ["Network Setup", "Cybersecurity", "Cloud Migration"],
    rating: 4.8,
    yearsExperience: 11,
    certifications: ["CISSP", "AWS Certified", "CompTIA Security+"],
    preferredPaymentTerms: "Net 15",
    taxId: "89-0123456",
    registrationDate: "2020-07-25",
    totalInvoicesSubmitted: 112,
    totalAmountBilled: 567000,
    averageProcessingTime: 1.5,
    complianceScore: 94.7,
    avatar: "/avatars/jennifer-lee.jpg"
  }
];

// Sample Invoices with Various Scenarios
export const sampleInvoices: Invoice[] = [
  // Perfect Match
  {
    id: "INV-001",
    contractorId: "CNT-001",
    contractorName: "Baker Oilfield Services",
    invoiceNumber: "BOS-2024-101",
    poNumber: "PO-12345",
    amount: 15750.00,
    description: "Flowback services for Well Site 12B",
    category: "Well Servicing",
    industry: "Oil & Gas",
    dateIssued: "2024-03-01",
    dateDue: "2024-03-31",
    dateSubmitted: "2024-03-02",
    dateProcessed: "2024-03-03",
    status: "approved",
    fileFormat: "PDF",
    fileName: "BOS-2024-101.pdf",
    lineItems: [
      { description: "Flowback services", quantity: 1, unitPrice: 15000.00, total: 15000.00, category: "Well Servicing" },
      { description: "Water hauling", quantity: 1, unitPrice: 750.00, total: 750.00, category: "Transportation" },
      { description: "Equipment rental", quantity: 1, unitPrice: 300.00, total: 300.00, category: "Equipment" }
    ],
    flags: ["Perfect Match", "Fast Processing"],
    processingTime: 1.2,
    approvedBy: "Manager A",
    matchConfidence: 98.5,
    riskScore: 2.1
  },
  
  // Amount Discrepancy
  {
    id: "INV-002",
    contractorId: "CNT-002",
    contractorName: "Chen Energy Logistics",
    invoiceNumber: "CE-2024-0156",
    poNumber: "PO-456789",
    amount: 8500.00,
    submittedAmount: 8750.00,
    description: "Crude hauling",
    category: "Transportation",
    industry: "Oil & Gas",
    dateIssued: "2024-01-10",
    dateDue: "2024-01-25",
    dateSubmitted: "2024-01-11",
    status: "disputed",
    fileFormat: "PDF",
    fileName: "CE-2024-0156.pdf",
    lineItems: [
      { description: "Crude hauling", quantity: 1, unitPrice: 8000.00, total: 8000.00, category: "Transportation" },
      { description: "Additional materials", quantity: 1, unitPrice: 4750.00, total: 4750.00, category: "Materials" },
      { description: "Permits and inspection", quantity: 1, unitPrice: 250.00, total: 250.00, category: "Consulting" },
      { description: "Installation labor", quantity: 8, unitPrice: 125.00, total: 1000.00, category: "Labor" }
    ],
    flags: ["Amount Discrepancy", "Manual Review Required"],
    notes: "Submitted amount $250 higher than PO. Under review for additional materials claim.",
    matchConfidence: 76.2,
    riskScore: 15.8
  },

  // Missing Invoice
  {
    id: "INV-003",
    contractorId: "CNT-003",
    contractorName: "Rodriguez HVAC Solutions",
    invoiceNumber: "RH-2024-0089",
    amount: 12300.00,
    description: "HVAC system maintenance",
    category: "Maintenance",
    industry: "Oil & Gas",
    dateIssued: "2024-01-05",
    dateDue: "2024-02-04",
    dateSubmitted: "2024-01-20",
    status: "processing",
    fileFormat: "PDF",
    fileName: "RH-2024-0089.pdf",
    lineItems: [
      { description: "Quarterly maintenance", quantity: 1, unitPrice: 8000.00, total: 8000.00, category: "Maintenance" },
      { description: "Filter replacement", quantity: 24, unitPrice: 125.00, total: 3000.00, category: "Materials" },
      { description: "Emergency repair", quantity: 1, unitPrice: 1300.00, total: 1300.00, category: "Maintenance" }
    ],
    flags: ["No Matching PO", "Missing Documentation"],
    notes: "No matching purchase order found in system. Contractor claims emergency work authorization.",
    processingTime: 4.5,
    matchConfidence: 45.3,
    riskScore: 28.7
  },

  // Duplicate Entry
  {
    id: "INV-004",
    contractorId: "CNT-004",
    contractorName: "Thompson Plumbing Pros",
    invoiceNumber: "TP-2024-0234",
    poNumber: "PO-123456",
    amount: 4850.00,
    description: "Emergency pipe repair",
    category: "Repair",
    industry: "Oil & Gas",
    dateIssued: "2024-01-12",
    dateDue: "2024-02-02",
    dateSubmitted: "2024-01-13",
    status: "rejected",
    fileFormat: "PDF",
    fileName: "TP-2024-0234.pdf",
    lineItems: [
      { description: "Emergency service call", quantity: 1, unitPrice: 350.00, total: 350.00, category: "Repair" },
      { description: "Pipe replacement", quantity: 25, unitPrice: 180.00, total: 4500.00, category: "Materials" }
    ],
    flags: ["Duplicate Detected", "Previously Paid"],
    rejectedReason: "Duplicate submission - invoice TP-2024-0233 already processed for same work.",
    matchConfidence: 95.1,
    riskScore: 85.2
  },

  // Large Commercial Project
  {
    id: "INV-005",
    contractorId: "CNT-007",
    contractorName: "Wilson Roofing & Repair",
    invoiceNumber: "WR-2024-0078",
    poNumber: "PO-999888",
    amount: 125000.00,
    description: "Commercial roof replacement - Phase 1",
    category: "Roofing",
    industry: "Oil & Gas",
    dateIssued: "2024-01-08",
    dateDue: "2024-03-08",
    dateSubmitted: "2024-01-09",
    dateProcessed: "2024-01-12",
    status: "approved",
    fileFormat: "PDF",
    fileName: "WR-2024-0078.pdf",
    lineItems: [
      { description: "TPO roofing membrane", quantity: 5000, unitPrice: 8.50, total: 42500.00, category: "Materials" },
      { description: "Insulation boards", quantity: 2000, unitPrice: 12.00, total: 24000.00, category: "Materials" },
      { description: "Installation crew", quantity: 200, unitPrice: 185.00, total: 37000.00, category: "Labor" },
      { description: "Equipment and crane rental", quantity: 5, unitPrice: 4300.00, total: 21500.00, category: "Equipment" }
    ],
    flags: ["Large Amount", "Multi-Phase Project", "Fast Processing"],
    processingTime: 3.2,
    approvedBy: "Senior Manager",
    matchConfidence: 94.7,
    riskScore: 8.3
  },

  // IT Services with Time Tracking
  {
    id: "INV-006",
    contractorId: "CNT-008",
    contractorName: "Lee IT Solutions",
    invoiceNumber: "LIT-2024-0445",
    poNumber: "PO-654321",
    amount: 8750.00,
    description: "Network security audit and implementation",
    category: "Consulting",
    industry: "Oil & Gas",
    dateIssued: "2024-01-14",
    dateDue: "2024-01-29",
    dateSubmitted: "2024-01-15",
    dateProcessed: "2024-01-16",
    status: "approved",
    fileFormat: "PDF",
    fileName: "LIT-2024-0445.pdf",
    lineItems: [
      { description: "Security audit - Senior consultant", quantity: 24, unitPrice: 225.00, total: 5400.00, category: "Consulting" },
      { description: "Implementation - Technical specialist", quantity: 16, unitPrice: 175.00, total: 2800.00, category: "Consulting" },
      { description: "Security software licenses", quantity: 1, unitPrice: 550.00, total: 550.00, category: "Software" }
    ],
    flags: ["Perfect Match", "Time Tracking Verified"],
    processingTime: 1.1,
    approvedBy: "IT Manager",
    matchConfidence: 97.2,
    riskScore: 3.8
  },

  // Landscaping Seasonal Work
  {
    id: "INV-007",
    contractorId: "CNT-005",
    contractorName: "Kim Landscaping & Design",
    invoiceNumber: "KL-2024-0167",
    poNumber: "PO-777555",
    amount: 6750.00,
    description: "Winter landscape maintenance",
    category: "Maintenance",
    industry: "Oil & Gas",
    dateIssued: "2024-01-06",
    dateDue: "2024-01-21",
    dateSubmitted: "2024-01-07",
    dateProcessed: "2024-01-09",
    status: "approved",
    fileFormat: "PDF",
    fileName: "KL-2024-0167.pdf",
    lineItems: [
      { description: "Tree trimming and pruning", quantity: 25, unitPrice: 125.00, total: 3125.00, category: "Maintenance" },
      { description: "Irrigation winterization", quantity: 1, unitPrice: 850.00, total: 850.00, category: "Maintenance" },
      { description: "Landscape cleanup", quantity: 32, unitPrice: 85.00, total: 2720.00, category: "Labor" },
      { description: "Salt and de-icing materials", quantity: 1, unitPrice: 55.00, total: 55.00, category: "Materials" }
    ],
    flags: ["Seasonal Work", "Perfect Match"],
    processingTime: 2.0,
    approvedBy: "Facilities Manager",
    matchConfidence: 91.8,
    riskScore: 5.1
  },

  // Security System with Warranty Issues
  {
    id: "INV-008",
    contractorId: "CNT-006",
    contractorName: "Foster Security Systems",
    invoiceNumber: "FS-2024-0298",
    poNumber: "PO-332211",
    amount: 23500.00,
    submittedAmount: 24750.00,
    description: "Access control system upgrade",
    category: "Security",
    industry: "Oil & Gas",
    dateIssued: "2024-01-18",
    dateDue: "2024-02-17",
    dateSubmitted: "2024-01-19",
    status: "processing",
    fileFormat: "PDF",
    fileName: "FS-2024-0298.pdf",
    lineItems: [
      { description: "Card readers (20 units)", quantity: 20, unitPrice: 450.00, total: 9000.00, category: "Hardware" },
      { description: "Access control panel", quantity: 1, unitPrice: 3500.00, total: 3500.00, category: "Hardware" },
      { description: "Installation and programming", quantity: 40, unitPrice: 185.00, total: 7400.00, category: "Labor" },
      { description: "Extended warranty", quantity: 1, unitPrice: 1250.00, total: 1250.00, category: "Service" },
      { description: "Additional security features", quantity: 1, unitPrice: 2350.00, total: 2350.00, category: "Hardware" }
    ],
    flags: ["Amount Discrepancy", "Warranty Addition", "Under Review"],
    notes: "Contractor added extended warranty and security features not in original PO. Awaiting approval.",
    processingTime: 5.8,
    matchConfidence: 82.4,
    riskScore: 18.9
  }
];

// Historical Data for Trends
export const historicalData: HistoricalData[] = [
  { month: "January", year: 2023, invoicesProcessed: 145, totalAmount: 1250000, averageProcessingTime: 3.2, accuracyRate: 89.3, costSavings: 78500, contractorCount: 45 },
  { month: "February", year: 2023, invoicesProcessed: 132, totalAmount: 1180000, averageProcessingTime: 3.1, accuracyRate: 90.1, costSavings: 82100, contractorCount: 47 },
  { month: "March", year: 2023, invoicesProcessed: 168, totalAmount: 1420000, averageProcessingTime: 2.9, accuracyRate: 90.8, costSavings: 89200, contractorCount: 52 },
  { month: "April", year: 2023, invoicesProcessed: 189, totalAmount: 1650000, averageProcessingTime: 2.8, accuracyRate: 91.5, costSavings: 95800, contractorCount: 54 },
  { month: "May", year: 2023, invoicesProcessed: 203, totalAmount: 1780000, averageProcessingTime: 2.7, accuracyRate: 92.1, costSavings: 102400, contractorCount: 58 },
  { month: "June", year: 2023, invoicesProcessed: 225, totalAmount: 1920000, averageProcessingTime: 2.6, accuracyRate: 92.8, costSavings: 108900, contractorCount: 61 },
  { month: "July", year: 2023, invoicesProcessed: 234, totalAmount: 2010000, averageProcessingTime: 2.5, accuracyRate: 93.2, costSavings: 115200, contractorCount: 63 },
  { month: "August", year: 2023, invoicesProcessed: 267, totalAmount: 2180000, averageProcessingTime: 2.4, accuracyRate: 93.7, costSavings: 121800, contractorCount: 67 },
  { month: "September", year: 2023, invoicesProcessed: 298, totalAmount: 2350000, averageProcessingTime: 2.3, accuracyRate: 94.1, costSavings: 128500, contractorCount: 71 },
  { month: "October", year: 2023, invoicesProcessed: 312, totalAmount: 2450000, averageProcessingTime: 2.2, accuracyRate: 94.5, costSavings: 134700, contractorCount: 74 },
  { month: "November", year: 2023, invoicesProcessed: 289, totalAmount: 2280000, averageProcessingTime: 2.1, accuracyRate: 94.8, costSavings: 141200, contractorCount: 76 },
  { month: "December", year: 2023, invoicesProcessed: 234, totalAmount: 1950000, averageProcessingTime: 2.0, accuracyRate: 95.2, costSavings: 147800, contractorCount: 78 },
  { month: "January", year: 2024, invoicesProcessed: 342, totalAmount: 2680000, averageProcessingTime: 1.9, accuracyRate: 95.6, costSavings: 156200, contractorCount: 82 }
];

// Success Stories and Testimonials
export const sampleTestimonials: Testimonial[] = [
  {
    id: "TEST-001",
    contractorName: "John Baker",
    company: "Baker Oilfield Services",
    role: "Owner",
    content: "InvoicePatch revolutionized how we handle our field tickets. What used to take days of paperwork now takes minutes.",
    rating: 5,
    date: "2024-02-20",
    industry: "Oil & Gas",
    featured: true
  },
  {
    id: "TEST-002",
    contractorName: "Sarah Chen",
    company: "Chen Energy Logistics",
    role: "CEO",
    content: "The dispute resolution features are fantastic. When there's a discrepancy, the system clearly shows what needs attention. It's saved us countless hours of back-and-forth emails.",
    rating: 5,
    date: "2024-01-10",
    industry: "Oil & Gas",
    featured: true
  },
  {
    id: "TEST-003",
    contractorName: "Amanda Foster",
    company: "Foster Security Systems",
    role: "Operations Manager",
    content: "The integration with our existing systems was seamless. The real-time tracking and notifications keep our team informed throughout the entire process.",
    rating: 5,
    date: "2024-01-08",
    industry: "Oil & Gas",
    featured: false
  },
  {
    id: "TEST-004",
    contractorName: "Jennifer Lee",
    company: "Lee IT Solutions",
    role: "Founder",
    content: "As a tech professional, I appreciate the sophisticated matching algorithms. The system accurately handles our complex time-based billing with multiple rate tiers.",
    rating: 5,
    date: "2024-01-05",
    industry: "Oil & Gas",
    featured: true
  },
  {
    id: "TEST-005",
    contractorName: "Mike Rodriguez",
    company: "Rodriguez HVAC Solutions",
    role: "Owner",
    content: "The mobile app makes it easy to submit invoices from job sites. The OCR technology accurately captures all the details, even from handwritten receipts.",
    rating: 4,
    date: "2023-12-28",
    industry: "Oil & Gas",
    featured: false
  },
  {
    id: "TEST-006",
    contractorName: "David Kim",
    company: "Kim Landscaping & Design",
    role: "Owner",
    content: "The seasonal billing features understand our industry's unique needs. InvoicePatch handles our varying workloads throughout the year perfectly.",
    rating: 5,
    date: "2023-12-20",
    industry: "Oil & Gas",
    featured: false
  }
];

export const testimonials: Testimonial[] = [
    {
    id: "TEST-001",
    contractorName: "Bill Ryder",
    company: "Ryder Flowback Inc.",
    role: "Owner / Operator",
    content: "InvoicePatch eliminated my paperwork completely. I just tap a few buttons on my phone at the well site, and my field ticket is done. My invoices are getting approved and paid in half the time.",
    rating: 5,
    date: "2024-06-15",
    industry: "Oil & Gas Services",
    featured: true
  },
  {
    id: "TEST-002",
    contractorName: "Maria Garcia",
    company: "Garcia Hauling",
    role: "Lead Driver",
    content: "The GPS tracking and photo uploads are game-changers. There are never any questions from the operator about my hours or location. It's the most straightforward system I've ever used.",
    rating: 5,
    date: "2024-05-28",
    industry: "Oil & Gas Logistics",
    featured: false
  },
];

export const industryCategories = [
  {
    name: "Oil & Gas Services",
    description: "Well servicing, flowback, water hauling, and more.",
    icon: "Drill"
  },
  {
    name: "Oil & Gas Logistics",
    description: "Crude hauling, rig moving, and equipment transport.",
    icon: "Truck"
  },
  {
    name: "General Construction",
    description: "Commercial and residential construction projects.",
    icon: "HardHat"
  },
  {
    name: "Specialized Trades",
    description: "HVAC, plumbing, electrical, and other trades.",
    icon: "Wrench"
  }
];

// Industry Categories and Job Types
const industries = [
  "Oil & Gas Services",
  "Oil & Gas Logistics",
  "Well Drilling",
  "Pipeline Services",
  "Directional Drilling",
  "Environmental Services",
  "Site Preparation",
];

const invoiceCategories = [
  "Well Servicing",
  "Equipment Rental",
  "Labor",
  "Transportation",
  "Materials",
  "Consulting",
  "Maintenance",
  "Waste Disposal",
  "Site Inspection",
  "Environmental Remediation",
];

// File Formats and Edge Cases
export const fileFormats = [
  "PDF",
  "JPEG",
  "PNG",
  "TIFF",
  "DOC",
  "DOCX",
  "XLS",
  "XLSX",
  "CSV"
];

export const edgeCases = [
  {
    scenario: "Handwritten Invoice",
    description: "Paper invoice with handwritten line items",
    challenges: ["OCR accuracy", "Unclear handwriting", "Missing structured data"],
    solution: "Advanced OCR with manual verification step"
  },
  {
    scenario: "Multi-Page Invoice",
    description: "Invoice spanning multiple pages with line items",
    challenges: ["Page separation", "Continuation tracking", "Total calculation"],
    solution: "Page sequence detection and intelligent parsing"
  },
  {
    scenario: "Foreign Language",
    description: "Invoice in Spanish with currency conversion needed",
    challenges: ["Language detection", "Currency conversion", "Cultural date formats"],
    solution: "Multi-language support with real-time conversion"
  },
  {
    scenario: "Damaged Document",
    description: "Partially damaged or blurry invoice scan",
    challenges: ["Image quality", "Missing information", "Confidence scoring"],
    solution: "Image enhancement and confidence-based processing"
  },
  {
    scenario: "Email Forward Chain",
    description: "Invoice buried in long email forward chain",
    challenges: ["Email parsing", "Attachment extraction", "Metadata preservation"],
    solution: "Smart email parsing with attachment prioritization"
  }
];

// Performance Metrics
export const performanceMetrics = {
  processingTimeReduction: 73.2,
  accuracyImprovement: 18.5,
  costSavingsIncrease: 156.3,
  contractorSatisfaction: 94.7,
  systemUptime: 99.97,
  averageResponseTime: 1.2,
  disputeResolutionTime: 65.8,
  automationRate: 87.3
};

// Export all data for easy import
export const sampleData = {
  contractors: sampleContractors,
  invoices: sampleInvoices,
  historical: historicalData,
  testimonials: sampleTestimonials,
  industries,
  invoiceCategories,
  fileFormats,
  edgeCases,
  performanceMetrics
};

export default sampleData; 