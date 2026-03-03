import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Check if keys exist before initializing to prevent build-time crashes
    if (!supabaseUrl || !supabaseKey) {
        // During the Vercel build phase, these might be undefined. 
        // Returning a placeholder prevents the "supabaseKey is required" error.
        return {} as any;
    }

    return createBrowserClient(supabaseUrl, supabaseKey);
}
