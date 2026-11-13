import type { Metadata } from 'next'
import Link from 'next/link'
import { Newspaper } from 'lucide-react'
import { Reveal } from '@/components/motion/reveal'
import { PageHero } from '@/components/site/page-hero'
import { CtaLink } from '@/components/site/cta-link'
import { Section } from '@/components/site/section'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { getNewsPosts } from '@/lib/articles-db'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'News',
  description: 'Company and product news from XIONGBA, published here as it becomes available.',
  alternates: { canonical: '/news' },
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(value))
}

export default async function NewsPage() {
  const posts = await getNewsPosts()

  return (
    <>
      <PageHero
        eyebrow="News"
        title="News from XIONGBA"
        description="Company and product updates will be published here."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'News' }]}
      />

      <Section id="news-list" labelledBy="news-list-title">
        <h2 id="news-list-title" className="sr-only">
          Latest news
        </h2>
        {posts.length === 0 ? (
          <Reveal>
            <Empty className="border border-dashed">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Newspaper aria-hidden="true" />
                </EmptyMedia>
                <EmptyTitle>No news published yet</EmptyTitle>
                <EmptyDescription>
                  We have not published any articles yet. In the meantime, browse the catalogue or send us your
                  requirements.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <CtaLink href="/products">Browse products</CtaLink>
                  <CtaLink href="/contact" variant="outline">
                    Contact us
                  </CtaLink>
                </div>
              </EmptyContent>
            </Empty>
          </Reveal>
        ) : (
          <ul className="divide-y border-y">
            {posts.map((post, index) => (
              <Reveal as="li" key={post.slug} delay={index * 60} className="py-8">
                <p className="text-muted-foreground text-sm">
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                </p>
                <h3 className="font-serif mt-2 text-2xl font-medium">
                  <Link href={`/news/${post.slug}`} className="hover:text-rust underline-offset-4 hover:underline">
                    {post.title}
                  </Link>
                </h3>
                <p className="text-muted-foreground mt-3 max-w-2xl leading-relaxed">{post.excerpt}</p>
              </Reveal>
            ))}
          </ul>
        )}
      </Section>
    </>
  )
}
