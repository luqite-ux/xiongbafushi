import 'server-only'
import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { adminSupabase, tenantId } from '@/lib/supabase'
import { siteConfig } from '@/lib/site'

// Verified fallback: customer workbook, 企业资料!C4 (address) and C6 (phone).
const fallback = {
  email: siteConfig.email as string,
  phone: '17205771033',
  address: '1/F, Building 2, No. 80 Xinghua Street, Yishan Town, Cangnan County, Wenzhou, Zhejiang, China',
}

const loadContact = unstable_cache(async () => {
  const { data, error } = await adminSupabase()
    .from('tenants')
    .select('contact_email,contact_phone,contact_address_i18n')
    .eq('id', tenantId)
    .single()
  if (error || !data) throw new Error('Contact settings unavailable')
  const addresses = data.contact_address_i18n as Record<string, string> | null
  return {
    email: data.contact_email?.trim() || fallback.email,
    phone: data.contact_phone?.trim() || fallback.phone,
    address: addresses?.en?.trim() || fallback.address,
  }
}, ['xiongbafushi-contact', tenantId], { revalidate: 60 })

export const getContactSettings = cache(async () => {
  try { return await loadContact() } catch { return fallback }
})
