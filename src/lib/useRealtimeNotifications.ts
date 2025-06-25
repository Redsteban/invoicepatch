import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner'; // shadcn/ui toast

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  created_at: string;
}

export function useRealtimeNotifications() {
  const [unread, setUnread] = useState<Notification[]>([]);

  useEffect(() => {
    const channel = supabase
      .channel('public:notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => {
          const notif = payload.new as Notification;
          if (notif.type === 'reminder' || notif.type === 'flag') {
            toast(notif.message, { description: notif.type });
          }
          setUnread((prev) => [notif, ...prev]);
        }
      )
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, []);

  return { unread };
} 