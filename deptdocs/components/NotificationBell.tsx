// components/NotificationBell.tsx
'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Bell } from 'lucide-react'

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<any[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const supabase = createClient()

    useEffect(() => {
        const setup = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            // 1. Initial Fetch
            const { data } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (data) {
                setNotifications(data)
                setUnreadCount(data.filter(n => !n.is_read).length)
            }

            // 2. REAL-TIME LISTENER
            const channel = supabase
                .channel('schema-db-changes')
                .on(
                    'postgres_changes',
                    { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
                    (payload) => {
                        setNotifications(prev => [payload.new, ...prev])
                        setUnreadCount(prev => prev + 1)
                    }
                )
                .subscribe()

            return () => { supabase.removeChannel(channel) }
        }
        setup()
    }, [])

    return (
        <div className="relative p-2 cursor-pointer hover:bg-gray-100 rounded-full transition-colors">
            <Bell size={20} className="text-gray-600" />
            {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white">
                    {unreadCount}
                </span>
            )}
        </div>
    )
}