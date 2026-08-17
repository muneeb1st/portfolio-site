import { createClient } from '@supabase/supabase-js'
import { cleanSupabaseUrl } from './supabase'

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
const cleanedUrl = cleanSupabaseUrl(rawUrl)

export const hasSupabaseAdmin = Boolean(
  cleanedUrl &&
  serviceRoleKey &&
  cleanedUrl.startsWith('https://') &&
  !cleanedUrl.includes('placeholder-project')
)

export const supabaseAdmin = hasSupabaseAdmin
  ? createClient(cleanedUrl, serviceRoleKey!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null

