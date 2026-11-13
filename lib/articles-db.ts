import { publicSupabase, tenantId } from '@/lib/supabase'

export type NewsPost = { slug:string; title:string; excerpt:string; body:string[]; publishedAt:string; featuredImage?:string }
const text = (value:any) => String(value ?? '').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()
const map = (row:any):NewsPost => ({ slug:row.slug, title:row.title_i18n?.en||row.title_en||row.title, excerpt:row.excerpt_i18n?.en||row.excerpt_en||row.excerpt||'', body:text(row.content_i18n?.en||row.content_en||row.content).split(/\n{2,}/).filter(Boolean), publishedAt:row.published_at||row.created_at, featuredImage:row.featured_image||undefined })
export async function getNewsPosts(){ const db=publicSupabase(); if(!db) return []; const {data,error}=await db.from('articles').select('*').eq('tenant_id',tenantId).eq('is_published',true).order('sort_order').order('published_at',{ascending:false}); return error?[]:(data??[]).map(map) }
export async function getNewsPostBySlug(slug:string){ const db=publicSupabase(); if(!db) return undefined; const {data,error}=await db.from('articles').select('*').eq('tenant_id',tenantId).eq('slug',slug).eq('is_published',true).maybeSingle(); return error||!data?undefined:map(data) }
