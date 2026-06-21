import { supabase } from './supabase'

/**
 * Triggers on-demand revalidation of the home page.
 * Call this after any successful update in the admin panel.
 */
export async function triggerRevalidation() {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    const res = await fetch('/api/revalidate', {
      method: 'POST',
      headers: session?.access_token
        ? { Authorization: `Bearer ${session.access_token}` }
        : undefined,
    })
    if (!res.ok) {
      console.error('Failed to revalidate path')
    }
    return await res.json()
  } catch (error) {
    console.error('Error triggering revalidation:', error)
  }
}
