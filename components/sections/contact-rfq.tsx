import Image from 'next/image'
import { Reveal } from '@/components/motion/reveal'
import { RfqForm, type ProductOption } from '@/components/rfq/rfq-form'
import { Section, SectionHeader } from '@/components/site/section'
import { getFacility } from '@/data/content'
import { listProducts } from '@/data/products'
import { siteConfig } from '@/lib/site'
import { getContactSettings } from '@/lib/contact-settings'

type ContactRfqProps = {
  variant?: 'home' | 'page'
  defaultProduct?: string
}

const rfqChecklist = [
  'The model you are interested in, or a reference garment you would like to develop',
  'Intended wearer and size range',
  'Fabric, colour, print, binding and construction direction',
  'Estimated quantity and target market, if known',
]

export async function ContactRfq({ variant = 'home', defaultProduct }: ContactRfqProps) {
  const products = await listProducts()
  const contact = await getContactSettings()
  const exterior = getFacility().find((image) => image.key === 'exterior')

  const productOptions: ProductOption[] = [
    ...products.map((product) => ({ value: product.slug, label: `${product.model} \u2014 ${product.shortName}` })),
    { value: 'custom-oem-odm', label: 'Custom OEM / ODM project' },
    { value: 'general', label: 'General catalogue enquiry' },
  ]
  const initialProduct = productOptions.some((option) => option.value === defaultProduct) ? defaultProduct : undefined
  const SummaryHeading = variant === 'home' ? 'h3' : 'h2'

  return (
    <Section id="contact-rfq" labelledBy="contact-rfq-title">
      {variant === 'home' ? (
        <SectionHeader
          id="contact-rfq-title"
          eyebrow="Contact / RFQ"
          title="Tell us what you are developing"
          description="Share the model, quantity and market you have in mind. Our team replies to the business email you provide."
          className="mb-12 md:mb-16"
        />
      ) : null}

      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <Reveal className="flex flex-col gap-8 lg:col-span-5">
          {exterior ? (
            <figure>
              <div className="bg-muted relative aspect-[16/10] overflow-hidden">
                <Image
                  src={exterior.src}
                  alt={exterior.alt}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="text-muted-foreground mt-3 text-sm">{exterior.caption}</figcaption>
            </figure>
          ) : null}

          <div>
            <SummaryHeading
              id={variant === 'page' ? 'contact-rfq-title' : undefined}
              className="font-serif text-2xl leading-snug font-medium sm:text-3xl"
            >
              {siteConfig.legalName}
            </SummaryHeading>
            <dl className="mt-6 divide-y border-y text-sm">
              <div className="grid grid-cols-[7rem_1fr] gap-4 py-3">
                <dt className="text-muted-foreground">Focus</dt>
                <dd>Children&apos;s and teen thermal underwear and base-layer sets</dd>
              </div>
              <div className="grid grid-cols-[7rem_1fr] gap-4 py-3">
                <dt className="text-muted-foreground">Address</dt>
                <dd>{contact.address}</dd>
              </div>
              <div className="grid grid-cols-[7rem_1fr] gap-4 py-3">
                <dt className="text-muted-foreground">Services</dt>
                <dd>Catalogue models, OEM and ODM development</dd>
              </div>
              <div className="grid grid-cols-[7rem_1fr] gap-4 py-3">
                <dt className="text-muted-foreground">Email</dt>
                <dd>
                  <a
                    href={`mailto:${contact.email}`}
                    className="hover:text-rust font-semibold underline underline-offset-4"
                  >
                    {contact.email}
                  </a>
                </dd>
              </div>
              <div className="grid grid-cols-[7rem_1fr] gap-4 py-3">
                <dt className="text-muted-foreground">Phone</dt>
                <dd><a href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`} className="hover:text-rust font-semibold underline underline-offset-4">{contact.phone}</a></dd>
              </div>
            </dl>
          </div>

          <div>
            <p className="text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase">
              What helps us reply
            </p>
            <ul className="mt-4 flex flex-col gap-3 text-sm leading-relaxed">
              {rfqChecklist.map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden="true" className="bg-rust mt-2 size-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={120} className="lg:col-span-7">
          <RfqForm productOptions={productOptions} defaultProduct={initialProduct} className="bg-card border p-6 sm:p-10" />
        </Reveal>
      </div>
    </Section>
  )
}
