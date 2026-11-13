import type { MetadataRoute } from 'next'
import { getNewsPosts } from '@/lib/articles-db'
import { listProducts } from '@/lib/products-db'

const origin = 'https://xiongbafushi.com'
const staticRoutes = ['', '/products', '/oem-odm', '/manufacturing', '/about', '/news', '/contact']

export const revalidate = 60

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, posts] = await Promise.all([listProducts(), getNewsPosts()])
  const staticPages = staticRoutes.map((route) => ({
    url: `${origin}${route || '/'}`,
    changeFrequency: route === '' ? 'weekly' as const : 'monthly' as const,
    priority: route === '' ? 1 : route === '/products' ? 0.9 : 0.7,
  }))
  const productPages = products.map((product) => ({
    url: `${origin}/products/${product.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))
  const articlePages = posts.map((post) => ({
    url: `${origin}/news/${post.slug}`,
    lastModified: post.publishedAt ? new Date(post.publishedAt) : undefined,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))
  return [...staticPages, ...productPages, ...articlePages]
}
