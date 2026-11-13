import { createSupabaseCaptchaContextFromEnv, verifyCaptchaSubmission } from '@/lib/inquiry-captcha'
import { adminSupabase, tenantId } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
const headers = { 'Cache-Control': 'no-store, max-age=0' }
const value = (input: unknown, max: number) => typeof input === 'string' ? input.trim().slice(0, max) : ''

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null
  const secret = process.env.CAPTCHA_SECRET?.trim()
  if (!secret) return Response.json({ message: 'Verification service is unavailable.' }, { status: 503, headers })
  try {
    const context = createSupabaseCaptchaContextFromEnv()
    const captcha = await verifyCaptchaSubmission({ secret, ...context, scope:value(body?.captchaScope,160), token:value(body?.captchaToken,4096), answer:value(body?.captchaAnswer,16) })
    if (!captcha.ok) return Response.json({ message:'The verification code is incorrect or expired. Please try again.' }, { status:400, headers })
  } catch { return Response.json({ message:'Verification service is unavailable.' }, { status:503, headers }) }
  const name=value(body?.name,200), email=value(body?.email,320), company=value(body?.company,200), message=value(body?.message,10000)
  if (!name || !company || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({ message:'Please complete the required business details.' }, { status:400, headers })
  const subject=[value(body?.productInterest,300),value(body?.quantity,100),value(body?.targetMarket,160)].filter(Boolean).join(' | ')
  const { data, error } = await adminSupabase().from('inquiries').insert({ tenant_id:tenantId,name,email,company,phone:value(body?.phone,80)||null,subject:subject||'Website RFQ',message,status:'unread' }).select('id').single()
  if (error) return Response.json({ message:'Your request could not be sent. Please try again.' }, { status:503, headers })
  return Response.json({ reference:data.id }, { status:201, headers })
}
