import type { MetadataRoute } from 'next'

const origin = 'https://xiongbafushi.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api'],
    },
    sitemap: `${origin}/sitemap.xml`,
    host: origin,
  }
}
