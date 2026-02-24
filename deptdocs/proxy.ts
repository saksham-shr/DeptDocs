import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export default async function proxy(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({ name, value, ...options })
                    response = NextResponse.next({
                        request: { headers: request.headers },
                    })
                    response.cookies.set({ name, value, ...options })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({ name, value: '', ...options })
                    response = NextResponse.next({
                        request: { headers: request.headers },
                    })
                    response.cookies.set({ name, value: '', ...options })
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()
    const pathname = request.nextUrl.pathname

    // 1. Protect routes if NOT logged in
    if (!user && (pathname.startsWith('/home') || pathname.startsWith('/onboarding'))) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // 2. Traffic Control for LOGGED IN users
    if (user) {
        // Check if they have finished onboarding by looking for their full name
        const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .single()

        const hasCompletedOnboarding = profile && profile.full_name && profile.full_name.trim() !== ''

        // If they haven't onboarded, force them to the onboarding page
        if (!hasCompletedOnboarding && (pathname.startsWith('/home') || pathname === '/' || pathname === '/login')) {
            return NextResponse.redirect(new URL('/onboarding', request.url))
        }

        // If they HAVE onboarded, keep them away from onboarding, login, and root
        if (hasCompletedOnboarding && (pathname.startsWith('/onboarding') || pathname === '/' || pathname === '/login')) {
            return NextResponse.redirect(new URL('/home', request.url))
        }
    }

    return response
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}