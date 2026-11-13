export type Locale = 'en'

export const defaultLocale: Locale = 'en'

export const siteConfig = {
  name: 'XIONGBA',
  legalName: 'Wenzhou Xiongba Apparel Co., Ltd.',
  email: 'info@xiongbafushi.com',
  location: 'Wenzhou, China',
  tagline: "Children's and teen thermal underwear sets",
  description:
    "Wenzhou Xiongba Apparel Co., Ltd. develops and manufactures children's and teen thermal underwear and base-layer sets. Browse the catalogue, review OEM / ODM options and send an RFQ.",
} as const

export const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'OEM / ODM', href: '/oem-odm' },
  { label: 'Manufacturing', href: '/manufacturing' },
  { label: 'About', href: '/about' },
  { label: 'News', href: '/news' },
  { label: 'Contact', href: '/contact' },
] as const

export function isActivePath(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}
