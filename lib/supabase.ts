import { createClient } from '@supabase/supabase-js'

export function cleanSupabaseUrl(url?: string): string {
  if (!url) return ''
  const cleaned = url.trim().replace(/^["']|["']$/g, '')
  try {
    const formatted = cleaned.startsWith('http://') || cleaned.startsWith('https://') 
      ? cleaned 
      : `https://${cleaned}`
    const parsed = new URL(formatted)
    return parsed.origin
  } catch {
    return cleaned.replace(/\/+$/, '').replace(/\/rest\/v1.*$/, '')
  }
}

export function cleanSupabaseKey(key?: string): string {
  if (!key) return ''
  return key.trim().replace(/^["']|["']$/g, '')
}

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const rawAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const cleanedUrl = cleanSupabaseUrl(rawUrl)
const cleanedKey = cleanSupabaseKey(rawAnonKey)

export const isSupabaseConfigured = Boolean(
  cleanedUrl &&
  cleanedKey &&
  cleanedUrl.startsWith('https://') &&
  !cleanedUrl.includes('placeholder-project')
)

const supabaseUrl = isSupabaseConfigured ? cleanedUrl : 'https://placeholder-project.supabase.co'
const supabaseAnonKey = isSupabaseConfigured ? cleanedKey : 'placeholder-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})
 
