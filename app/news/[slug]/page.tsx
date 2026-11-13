import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Reveal } from '@/components/motion/reveal'
import { CtaLink } from '@/components/site/cta-link'
import { PageHero } from '@/components/site/page-hero'
import { Section } from '@/components/site/section'
import { getNewsPostBySlug } from '@/lib/articles-db'

export const revalidate = 60
export const dynamicParams = true

type NewsPostPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: NewsPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getNewsPostBySlug(slug)
  if (!post) return { title: 'Article not found' }
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/news/${post.slug}` },
  }
}

export default async function NewsPostPage({ params }: NewsPostPageProps) {
  const { slug } = await params
  const post = await getNewsPostBySlug(slug)
  if (!post) notFound()

  const date = new Intl.DateTimeFormat('en-GB', { dateStyle: 'long', timeZone: 'UTC' }).format(
    new Date(post.publishedAt),
  )

  return (
    <>
      <PageHero
        eyebrow={date}
        title={post.title}
        description={post.excerpt}
        crumbs={[{ label: 'Home', href: '/' }, { label: 'News', href: '/news' }, { label: post.title }]}
      />
      <Section id="article" labelledBy="article-heading">
        <h2 id="article-heading" className="sr-only">
          Article
        </h2>
        <Reveal className="mx-auto max-w-2xl">
          <div className="flex flex-col gap-5 text-lg leading-relaxed">
            {post.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-12">
            <CtaLink href="/news" variant="text">
              Back to News
            </CtaLink>
          </div>
        </Reveal>
      </Section>
    </>
  )
}
