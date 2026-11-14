import type { Metadata, Viewport } from 'next'
import { cookies } from 'next/headers'
import { Hanken_Grotesk, Newsreader } from 'next/font/google'
import { SiteFooter } from '@/components/site/site-footer'
import { SiteHeader } from '@/components/site/site-header'
import { siteConfig } from '@/lib/site'
import { getContactSettings } from '@/lib/contact-settings'
import { PREVIEW_COOKIE, siteContentMetadata } from '@/lib/site-content/site-content'
import './globals.css'

const display = Newsreader({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const body = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const baseMetadata: Metadata = {
  metadataBase: new URL('https://xiongbafushi.com'),
  title: {
    default: `${siteConfig.name} | Children's and Teen Thermal Underwear Manufacturer`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  robots: { index: true, follow: true, 'max-image-preview': 'large' },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    title: `${siteConfig.name} | Children's and Teen Thermal Underwear Manufacturer`,
    description: siteConfig.description,
    images: [{ url: '/images/hero/hero-teens.jpg', alt: 'Two teenagers in cream thermal sets' }],
  },
}

export async function generateMetadata(): Promise<Metadata> {
  try { return { ...baseMetadata, ...(await siteContentMetadata('/', 'en')) } } catch { return baseMetadata }
}

export const viewport: Viewport = {
  themeColor: '#f8f1e6',
  width: 'device-width',
  initialScale: 1,
}

const motionReadyScript = `(function(){try{var d=document.documentElement;if(window.matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window))return;d.setAttribute('data-motion','ready');window.addEventListener('error',function(){d.removeAttribute('data-motion')})}catch(e){}})();`

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const preview = (await cookies()).has(PREVIEW_COOKIE)
  const contact = await getContactSettings()
  const schema = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Organization', '@id': 'https://xiongbafushi.com/#organization', name: siteConfig.legalName, url: 'https://xiongbafushi.com', logo: 'https://xiongbafushi.com/icon.svg', email: contact.email, telephone: contact.phone, address: contact.address },
    { '@type': 'WebSite', '@id': 'https://xiongbafushi.com/#website', name: siteConfig.name, url: 'https://xiongbafushi.com', publisher: { '@id': 'https://xiongbafushi.com/#organization' }, inLanguage: 'en' },
  ] }
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
        <script dangerouslySetInnerHTML={{ __html: motionReadyScript }} />
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}.hero-slide:not([data-active='true']){display:none}.hero-slide[data-active='true']{opacity:1;visibility:visible}`}</style>
        </noscript>
      </head>
      <body className="font-sans antialiased">
        {preview ? <div className="bg-ink text-ink-foreground sticky top-0 z-[100] flex items-center justify-between gap-4 px-4 py-2 text-sm"><span>Preview mode — unpublished content is visible.</span><form action="/api/site-content/exit-preview" method="post"><button type="submit" className="underline underline-offset-4">Exit preview</button></form></div> : null}
        <a
          href="#main"
          className="bg-ink text-ink-foreground sr-only z-50 px-4 py-3 text-sm font-semibold focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
