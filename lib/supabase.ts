import { createClient } from '@supabase/supabase-js'

export const tenantId = process.env.NEXT_PUBLIC_TENANT_ID?.trim() ?? ''

export function publicSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  if (!url || !key || !tenantId) return null
  return createClient(url, key, { auth: { persistSession: false } })
}

export function adminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  if (!url || !key || !tenantId) throw new Error('Supabase server environment is incomplete')
  return createClient(url, key, { auth: { persistSession: false } })
}
