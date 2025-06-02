// Analytics and tracking utilities for InvoicePatch
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_title: document.title,
    page_location: window.location.href,
  });
};

// Track custom events
export const trackEvent = (event: AnalyticsEvent) => {
  if (typeof window === 'undefined' || !window.gtag) {
    console.log('Analytics event (dev):', event);
    return;
  }

  window.gtag('event', event.action, {
    event_category: event.category,
    event_label: event.label,
    value: event.value,
    ...event.custom_parameters,
  });
};

// Conversion funnel tracking
export const ConversionEvents = {
  // Landing page events
  LANDING_PAGE_VIEW: 'landing_page_view',
  HERO_CTA_CLICK: 'hero_cta_click',
  PRICING_VIEWED: 'pricing_viewed',
  FAQ_EXPANDED: 'faq_expanded',
  
  // Checkout funnel
  CHECKOUT_INITIATED: 'checkout_initiated',
  PAYMENT_METHOD_SELECTED: 'payment_method_selected',
  CHECKOUT_COMPLETED: 'checkout_completed',
  CHECKOUT_ABANDONED: 'checkout_abandoned',
  
  // Success page events
  SUCCESS_PAGE_VIEW: 'success_page_view',
  SLACK_INVITE_CLICKED: 'slack_invite_clicked',
  PDF_DOWNLOADED: 'pdf_downloaded',
  REFERRAL_LINK_COPIED: 'referral_link_copied',
  SOCIAL_SHARE_CLICKED: 'social_share_clicked',
  
  // Engagement events
  EMAIL_SUBSCRIBED: 'email_subscribed',
  REFERRAL_SENT: 'referral_sent',
  FEATURE_DEMO_VIEWED: 'feature_demo_viewed',
  TESTIMONIAL_VIEWED: 'testimonial_viewed',
  
  // Revenue events
  PURCHASE: 'purchase',
  REFUND: 'refund',
  UPGRADE: 'upgrade',
  CHURN: 'churn',
} as const;

// Track conversion funnel steps
export const trackConversion = (
  step: keyof typeof ConversionEvents,
  additionalData?: Record<string, any>
) => {
  trackEvent({
    action: ConversionEvents[step],
    category: 'conversion_funnel',
    label: step.toLowerCase(),
    custom_parameters: additionalData,
  });
};

// Track revenue events
export const trackRevenue = (
  amount: number,
  currency: string = 'CAD',
  transactionId?: string,
  items?: Array<{
    item_id: string;
    item_name: string;
    category: string;
    quantity: number;
    price: number;
  }>
) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'purchase', {
    transaction_id: transactionId,
    value: amount,
    currency,
    items,
  });
};

// Track user engagement
export const trackEngagement = (
  element: string,
  action: string,
  timeSpent?: number
) => {
  trackEvent({
    action: 'user_engagement',
    category: 'engagement',
    label: `${element}_${action}`,
    value: timeSpent,
    custom_parameters: {
      element,
      interaction_type: action,
    },
  });
};

// Track scroll depth
export const trackScrollDepth = (percentage: number) => {
  trackEvent({
    action: 'scroll_depth',
    category: 'engagement',
    label: `${percentage}%`,
    value: percentage,
  });
};

// Track form interactions
export const trackFormEvent = (
  formName: string,
  action: 'started' | 'completed' | 'abandoned',
  fieldName?: string
) => {
  trackEvent({
    action: 'form_interaction',
    category: 'forms',
    label: `${formName}_${action}`,
    custom_parameters: {
      form_name: formName,
      form_action: action,
      field_name: fieldName,
    },
  });
};

// Track page views with enhanced data
export const trackPageView = (
  page: string,
  additionalData?: Record<string, any>
) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('config', GA_MEASUREMENT_ID!, {
    page_title: document.title,
    page_location: window.location.href,
    custom_map: additionalData,
  });
};

// Enhanced e-commerce tracking for subscription business
export const trackSubscriptionEvent = (
  action: 'subscribe' | 'unsubscribe' | 'upgrade' | 'downgrade',
  planType: string,
  value?: number
) => {
  trackEvent({
    action: 'subscription_action',
    category: 'subscriptions',
    label: `${action}_${planType}`,
    value,
    custom_parameters: {
      subscription_action: action,
      plan_type: planType,
    },
  });
};

// Track referral program events
export const trackReferralEvent = (
  action: 'invite_sent' | 'referral_completed' | 'reward_earned',
  referralCode?: string,
  rewardValue?: number
) => {
  trackEvent({
    action: 'referral_program',
    category: 'referrals',
    label: action,
    value: rewardValue,
    custom_parameters: {
      referral_action: action,
      referral_code: referralCode,
    },
  });
};

// Track component interactions for A/B testing
export const trackComponentInteraction = (
  componentName: string,
  variant: string,
  action: string
) => {
  trackEvent({
    action: 'component_interaction',
    category: 'ab_testing',
    label: `${componentName}_${variant}_${action}`,
    custom_parameters: {
      component: componentName,
      variant,
      interaction: action,
    },
  });
};

// Utility to track time spent on page
export class PageTimeTracker {
  private startTime: number;
  private pageName: string;

  constructor(pageName: string) {
    this.startTime = Date.now();
    this.pageName = pageName;
  }

  trackTimeSpent() {
    const timeSpent = Math.round((Date.now() - this.startTime) / 1000);
    trackEvent({
      action: 'time_on_page',
      category: 'engagement',
      label: this.pageName,
      value: timeSpent,
    });
  }
}

// Hook for tracking page time
export const usePageTimeTracking = (pageName: string) => {
  if (typeof window === 'undefined') return;

  const tracker = new PageTimeTracker(pageName);

  // Track when user leaves the page
  const handleBeforeUnload = () => {
    tracker.trackTimeSpent();
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  
  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
    tracker.trackTimeSpent();
  };
}; 