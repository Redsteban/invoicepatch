// TypeScript interfaces for InvoicePatch payment integration

// Database types for Supabase integration

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      pre_order_customers: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          company_name: string
          contractor_count: number
          current_invoicing_method: string
          biggest_pain_point: string
          amount_paid: number
          plan_type: string
          stripe_customer_id: string | null
          stripe_session_id: string | null
          referral_code: string | null
          referred_by: string | null
          email_sequences_subscribed: string[]
          founder_number: number | null
          is_founder: boolean
          status: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          email: string
          company_name: string
          contractor_count: number
          current_invoicing_method: string
          biggest_pain_point: string
          amount_paid: number
          plan_type: string
          stripe_customer_id?: string | null
          stripe_session_id?: string | null
          referral_code?: string | null
          referred_by?: string | null
          email_sequences_subscribed?: string[]
          founder_number?: number | null
          is_founder?: boolean
          status?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          company_name?: string
          contractor_count?: number
          current_invoicing_method?: string
          biggest_pain_point?: string
          amount_paid?: number
          plan_type?: string
          stripe_customer_id?: string | null
          stripe_session_id?: string | null
          referral_code?: string | null
          referred_by?: string | null
          email_sequences_subscribed?: string[]
          founder_number?: number | null
          is_founder?: boolean
          status?: string
        }
      }
      email_subscribers: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          first_name: string | null
          last_name: string | null
          subscription_source: string
          is_active: boolean
          tags: string[]
          convertkit_subscriber_id: string | null
          unsubscribed_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          email: string
          first_name?: string | null
          last_name?: string | null
          subscription_source: string
          is_active?: boolean
          tags?: string[]
          convertkit_subscriber_id?: string | null
          unsubscribed_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          subscription_source?: string
          is_active?: boolean
          tags?: string[]
          convertkit_subscriber_id?: string | null
          unsubscribed_at?: string | null
        }
      }
      referrals: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          referrer_email: string
          referred_email: string
          referral_code: string
          status: string
          commission_amount: number | null
          commission_paid: boolean
          commission_paid_at: string | null
          stripe_payment_intent_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          referrer_email: string
          referred_email: string
          referral_code: string
          status?: string
          commission_amount?: number | null
          commission_paid?: boolean
          commission_paid_at?: string | null
          stripe_payment_intent_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          referrer_email?: string
          referred_email?: string
          referral_code?: string
          status?: string
          commission_amount?: number | null
          commission_paid?: boolean
          commission_paid_at?: string | null
          stripe_payment_intent_id?: string | null
        }
      }
      analytics_events: {
        Row: {
          id: string
          created_at: string
          event_name: string
          event_data: Json
          user_id: string | null
          session_id: string | null
          page_url: string | null
          user_agent: string | null
          ip_address: string | null
          referrer: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          event_name: string
          event_data?: Json
          user_id?: string | null
          session_id?: string | null
          page_url?: string | null
          user_agent?: string | null
          ip_address?: string | null
          referrer?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          event_name?: string
          event_data?: Json
          user_id?: string | null
          session_id?: string | null
          page_url?: string | null
          user_agent?: string | null
          ip_address?: string | null
          referrer?: string | null
        }
      }
      waiting_list: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          company_name: string | null
          contractor_count: number | null
          current_pain_points: string[]
          expected_monthly_invoice_volume: number | null
          priority_score: number
          status: string
          notified_at: string | null
          converted_to_customer: boolean
          converted_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          email: string
          company_name?: string | null
          contractor_count?: number | null
          current_pain_points?: string[]
          expected_monthly_invoice_volume?: number | null
          priority_score?: number
          status?: string
          notified_at?: string | null
          converted_to_customer?: boolean
          converted_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          company_name?: string | null
          contractor_count?: number | null
          current_pain_points?: string[]
          expected_monthly_invoice_volume?: number | null
          priority_score?: number
          status?: string
          notified_at?: string | null
          converted_to_customer?: boolean
          converted_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      customer_status: 'pending' | 'active' | 'inactive' | 'refunded'
      plan_type: 'contractor_monthly' | 'manager_platform' | 'complete_system'
      invoicing_method: 'manual' | 'excel' | 'quickbooks' | 'other_software' | 'none'
      pain_point: 'late_payments' | 'follow_up_hassle' | 'tax_compliance' | 'time_consuming' | 'poor_organization' | 'client_disputes'
      referral_status: 'pending' | 'completed' | 'cancelled'
      waiting_list_status: 'active' | 'notified' | 'converted' | 'removed'
      subscription_source: 'landing_page' | 'pricing_page' | 'blog' | 'referral' | 'social_media' | 'direct'
    }
  }
}

// Helper types for application use
export type PreOrderCustomer = Database['public']['Tables']['pre_order_customers']['Row']
export type PreOrderCustomerInsert = Database['public']['Tables']['pre_order_customers']['Insert']
export type PreOrderCustomerUpdate = Database['public']['Tables']['pre_order_customers']['Update']

export type EmailSubscriber = Database['public']['Tables']['email_subscribers']['Row']
export type EmailSubscriberInsert = Database['public']['Tables']['email_subscribers']['Insert']
export type EmailSubscriberUpdate = Database['public']['Tables']['email_subscribers']['Update']

export type Referral = Database['public']['Tables']['referrals']['Row']
export type ReferralInsert = Database['public']['Tables']['referrals']['Insert']
export type ReferralUpdate = Database['public']['Tables']['referrals']['Update']

export type AnalyticsEvent = Database['public']['Tables']['analytics_events']['Row']
export type AnalyticsEventInsert = Database['public']['Tables']['analytics_events']['Insert']

export type WaitingListEntry = Database['public']['Tables']['waiting_list']['Row']
export type WaitingListInsert = Database['public']['Tables']['waiting_list']['Insert']
export type WaitingListUpdate = Database['public']['Tables']['waiting_list']['Update']

// Enums
export type CustomerStatus = Database['public']['Enums']['customer_status']
export type PlanType = Database['public']['Enums']['plan_type']
export type InvoicingMethod = Database['public']['Enums']['invoicing_method']
export type PainPoint = Database['public']['Enums']['pain_point']
export type ReferralStatus = Database['public']['Enums']['referral_status']
export type WaitingListStatus = Database['public']['Enums']['waiting_list_status']
export type SubscriptionSource = Database['public']['Enums']['subscription_source']
