import { getProductBySlug as fallbackBySlug, listProducts as fallbackList, type Product } from '@/data/products'
import { publicSupabase, tenantId } from '@/lib/supabase'

type ProductRow = Record<string, any>
const first = (value: any) => Array.isArray(value) ? value : []
function mapRow(row: ProductRow, fallback?: Product): Product {
  const specs = Object.entries(row.specs ?? {}).map(([label, value]) => ({ label, value: String(value) }))
  const urls = [row.image_url, ...first(row.extra_data?.images)].filter(Boolean).filter((url, index, all) => all.indexOf(url) === index)
  const name = row.name_i18n?.en || row.name_en || row.name
  const applications = first(row.applications_i18n?.en || row.applications)
  return {
    slug: row.slug, model: row.model || '', name, shortName: name.replace(/^Kids' |^Teen Girls' /, ''),
    summary: row.description_i18n?.en || row.description_en || row.description || '',
    description: row.overview_i18n?.en || row.overview_en || row.overview || row.description || '',
    wearer: /teen/i.test(name) ? 'Teen girls' : 'Children',
    fabricGroup: /lycra/i.test(name) ? 'Lycra cotton' : /cotton candy|soft knit/i.test(name) ? 'Cotton soft knit' : 'Brushed fleece',
    fit: String(row.specs?.Fit || row.specs?.Style || fallback?.fit || ''),
    useScenarios: applications.length ? applications : fallback?.useScenarios || [],
    specs,
    images: urls.map((src: string, index: number) => ({ src, alt: `${row.model} ${name} ${index ? `gallery image ${index + 1}` : 'main image'}`, caption: index ? `Gallery image ${index + 1}` : 'Main product view', view: index ? 'detail' : 'garment' })),
  }
}

export async function listProducts(): Promise<Product[]> {
  const db = publicSupabase(); if (!db) return fallbackList()
  const { data, error } = await db.from('products').select('*').eq('tenant_id', tenantId).eq('is_active', true).order('sort_order')
  if (error || !data?.length) return fallbackList()
  const fallbackProducts = await fallbackList()
  return data.map((row) => mapRow(row, fallbackProducts.find((product) => product.slug === row.slug)))
}
export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const db = publicSupabase(); if (!db) return fallbackBySlug(slug)
  const { data, error } = await db.from('products').select('*').eq('tenant_id', tenantId).eq('slug', slug).eq('is_active', true).maybeSingle()
  if (error || !data) return fallbackBySlug(slug)
  return mapRow(data, await fallbackBySlug(slug))
}
