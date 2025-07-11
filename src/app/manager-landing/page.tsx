'use client';

import { motion } from 'framer-motion';
import { 
  Fuel, 
  ArrowRight, 
  CheckCircle, 
  BarChart3, 
  Users, 
  FileText, 
  Drill,
  Play,
  Sparkles
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ManagerLanding() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerChildren = {
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const features = [
    {
      icon: FileText,
      title: "Invoice Processing",
      description: "Automated invoice validation, and approval workflows"
    },
    {
      icon: Users,
      title: "Sub-contractor Oversight",
      description: "Comprehensive oversight of sub-contractor performance and compliance"
    },
    {
      icon: BarChart3,
      title: "Operations Analytics",
      description: "Real-time insights into costs, equipment uptime, and project metrics"
    },
    {
      icon: Fuel,
      title: "Cost Reconciliation",
      description: "Streamlined cost tracking with automated reconciliation"
    }
  ];

  const benefits = [
    "Reduce ticket processing time by 80%",
    "Eliminate manual data entry errors",
    "Real-time operational cost tracking",
    "Automated compliance and safety monitoring",
    "Instant payment status for sub-contractors",
    "Comprehensive digital audit trails"
  ];

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Manager access is temporarily disabled.</h1>
        <p className="text-lg text-gray-700">Please use the contractor section.</p>
      </div>
    </div>
  );
} 