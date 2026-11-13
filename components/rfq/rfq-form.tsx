'use client'

import { useId, useRef, useState, type FormEvent } from 'react'
import { CheckCircle2, Loader2, TriangleAlert } from 'lucide-react'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { submitRfq, type RfqPayload } from '@/lib/rfq'
import { cn } from '@/lib/utils'
import { InquiryCaptchaField } from '@/components/inquiry-captcha-field'

export type ProductOption = { value: string; label: string }

type RfqFormProps = {
  productOptions: ProductOption[]
  defaultProduct?: string
  className?: string
}

type Status = 'idle' | 'submitting' | 'success' | 'error'
type FieldName = 'name' | 'email' | 'company' | 'productInterest' | 'message'
type Errors = Partial<Record<FieldName, string>>

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const selectClass =
  'border-input bg-transparent h-11 w-full rounded-md border px-3 text-base shadow-xs outline-none md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:border-destructive aria-invalid:ring-destructive/20'

const controlClass = 'h-11'

function readValue(data: FormData, key: string) {
  const value = data.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

function validate(data: FormData): Errors {
  const errors: Errors = {}
  if (!readValue(data, 'name')) errors.name = 'Enter your name.'
  const email = readValue(data, 'email')
  if (!email) errors.email = 'Enter your business email.'
  else if (!emailPattern.test(email)) errors.email = 'Enter a valid email address.'
  if (!readValue(data, 'company')) errors.company = 'Enter your company name.'
  if (!readValue(data, 'productInterest')) errors.productInterest = 'Choose a product or project type.'
  if (readValue(data, 'message').length < 10) errors.message = 'Tell us a little more about what you need.'
  return errors
}

export function RfqForm({ productOptions, defaultProduct, className }: RfqFormProps) {
  const uid = useId()
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Errors>({})
  const [serverMessage, setServerMessage] = useState('')
  const [captchaRefreshKey, setCaptchaRefreshKey] = useState(0)

  const id = (name: string) => `${uid}-${name}`
  const describedBy = (name: FieldName) => (errors[name] ? `${id(name)}-error` : undefined)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'submitting') return

    const data = new FormData(event.currentTarget)
    const nextErrors = validate(data)
    setErrors(nextErrors)

    const firstInvalid = (Object.keys(nextErrors) as FieldName[])[0]
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus()
      return
    }

    const payload: RfqPayload = {
      name: readValue(data, 'name'),
      email: readValue(data, 'email'),
      company: readValue(data, 'company'),
      phone: readValue(data, 'phone') || undefined,
      productInterest: readValue(data, 'productInterest'),
      quantity: readValue(data, 'quantity') || undefined,
      targetMarket: readValue(data, 'targetMarket') || undefined,
      message: readValue(data, 'message'),
      captchaScope: readValue(data, 'captchaScope'),
      captchaToken: readValue(data, 'captchaToken'),
      captchaAnswer: readValue(data, 'captchaAnswer'),
    }

    setStatus('submitting')
    setServerMessage('')
    const result = await submitRfq(payload)

    if (result.ok) {
      setStatus('success')
      return
    }
    setServerMessage(result.message)
    setStatus('error')
    setCaptchaRefreshKey((value) => value + 1)
  }

  if (status === 'success') {
    return (
      <div
        role="status"
        className={cn('state-in bg-card border-foreground/20 flex flex-col items-start gap-5 border p-8 md:p-10', className)}
      >
        <CheckCircle2 aria-hidden="true" className="text-rust size-9" />
        <h3 className="font-serif text-3xl leading-tight font-medium">Your RFQ has been sent</h3>
        <p className="text-muted-foreground max-w-md leading-relaxed">
          Thank you. Our team will review your requirements and reply to the business email you provided.
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus('idle')
            setErrors({})
          }}
          className="text-foreground decoration-rust hover:text-rust min-h-11 text-sm font-semibold underline decoration-2 underline-offset-[6px]"
        >
          Send another RFQ
        </button>
      </div>
    )
  }

  const submitting = status === 'submitting'

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      aria-busy={submitting}
      aria-labelledby={id('title')}
      className={cn('bg-card border-foreground/20 border p-6 md:p-10', className)}
    >
      <h3 id={id('title')} className="font-serif text-3xl leading-tight font-medium">
        Send your RFQ
      </h3>
      <p className="text-muted-foreground mt-2 mb-8 text-sm">Fields marked with an asterisk are required.</p>

      <FieldGroup className="gap-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Field data-invalid={Boolean(errors.name)}>
            <FieldLabel htmlFor={id('name')}>
              Name <span aria-hidden="true">*</span>
            </FieldLabel>
            <Input
              id={id('name')}
              name="name"
              autoComplete="name"
              required
              aria-required="true"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={describedBy('name')}
              className={controlClass}
            />
            {errors.name ? <FieldError id={`${id('name')}-error`}>{errors.name}</FieldError> : null}
          </Field>

          <Field data-invalid={Boolean(errors.email)}>
            <FieldLabel htmlFor={id('email')}>
              Business email <span aria-hidden="true">*</span>
            </FieldLabel>
            <Input
              id={id('email')}
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              required
              aria-required="true"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={describedBy('email')}
              className={controlClass}
            />
            {errors.email ? <FieldError id={`${id('email')}-error`}>{errors.email}</FieldError> : null}
          </Field>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Field data-invalid={Boolean(errors.company)}>
            <FieldLabel htmlFor={id('company')}>
              Company <span aria-hidden="true">*</span>
            </FieldLabel>
            <Input
              id={id('company')}
              name="company"
              autoComplete="organization"
              required
              aria-required="true"
              aria-invalid={Boolean(errors.company)}
              aria-describedby={describedBy('company')}
              className={controlClass}
            />
            {errors.company ? <FieldError id={`${id('company')}-error`}>{errors.company}</FieldError> : null}
          </Field>

          <Field>
            <FieldLabel htmlFor={id('phone')}>Phone / WhatsApp (optional)</FieldLabel>
            <Input
              id={id('phone')}
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              className={controlClass}
            />
          </Field>
        </div>

        <Field data-invalid={Boolean(errors.productInterest)}>
          <FieldLabel htmlFor={id('product')}>
            Product interest <span aria-hidden="true">*</span>
          </FieldLabel>
          <select
            id={id('product')}
            name="productInterest"
            defaultValue={defaultProduct ?? ''}
            required
            aria-required="true"
            aria-invalid={Boolean(errors.productInterest)}
            aria-describedby={describedBy('productInterest')}
            className={selectClass}
          >
            <option value="" disabled>
              Select a model or project type
            </option>
            {productOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.productInterest ? (
            <FieldError id={`${id('productInterest')}-error`}>{errors.productInterest}</FieldError>
          ) : null}
        </Field>

        <div className="grid gap-6 md:grid-cols-2">
          <Field>
            <FieldLabel htmlFor={id('quantity')}>Estimated quantity (optional)</FieldLabel>
            <Input id={id('quantity')} name="quantity" placeholder="For example, sets per colour" className={controlClass} />
          </Field>
          <Field>
            <FieldLabel htmlFor={id('market')}>Target market (optional)</FieldLabel>
            <Input id={id('market')} name="targetMarket" autoComplete="off" className={controlClass} />
          </Field>
        </div>

        <Field data-invalid={Boolean(errors.message)}>
          <FieldLabel htmlFor={id('message')}>
            Message <span aria-hidden="true">*</span>
          </FieldLabel>
          <Textarea
            id={id('message')}
            name="message"
            rows={5}
            required
            aria-required="true"
            aria-invalid={Boolean(errors.message)}
            aria-describedby={describedBy('message')}
            placeholder="Sizes, fabric, colours, print or binding requirements, and any reference you have."
          />
          {errors.message ? <FieldError id={`${id('message')}-error`}>{errors.message}</FieldError> : null}
        </Field>

        <InquiryCaptchaField refreshKey={captchaRefreshKey} className="[&_label]:text-foreground [&_button]:rounded-none [&_input]:rounded-none" />
      </FieldGroup>

      {status === 'error' ? (
        <div
          role="alert"
          className="state-in border-destructive/50 text-destructive mt-8 flex items-start gap-3 border bg-[color-mix(in_oklab,var(--destructive)_6%,var(--card))] p-4 text-sm"
        >
          <TriangleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <p>{serverMessage}</p>
        </div>
      ) : null}

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={submitting}
          className="bg-ink text-ink-foreground hover:bg-rust hover:text-rust-foreground inline-flex min-h-12 items-center justify-center gap-2 px-8 text-sm font-semibold tracking-wide transition-[background-color,color,transform] duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? (
            <>
              <Loader2 aria-hidden="true" className="size-4 animate-spin motion-reduce:animate-none" />
              Sending
            </>
          ) : (
            'Send RFQ'
          )}
        </button>
        <p className="text-muted-foreground text-sm" aria-live="polite">
          {submitting ? 'Sending your request…' : 'We reply to the business email you provide.'}
        </p>
      </div>
    </form>
  )
}
