// lib/logger.ts
import { createClient } from '@/utils/supabase/client';

export const logActivity = async (
  actionType: string, 
  description: string, 
  targetId?: string
) => {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return

  // Using user_metadata for the name or falling back to the email
  const fullName = user.user_metadata?.full_name || user.email

  await supabase.from('activity_logs').insert({
    user_id: user.id,
    user_name: fullName,
    action_type: actionType,
    description: description,
    target_id: targetId
  })
}