export type RfqPayload = {
  name: string
  email: string
  company: string
  phone?: string
  productInterest: string
  quantity?: string
  targetMarket?: string
  message: string
  captcha?: string
}

export type RfqResult = { ok: true } | { ok: false; message: string }

export const rfqEndpoint = '/api/rfq'

export async function submitRfq(payload: RfqPayload): Promise<RfqResult> {
  try {
    const response = await fetch(rfqEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (response.ok) return { ok: true }

    const data = (await response.json().catch(() => null)) as { message?: string } | null
    return { ok: false, message: data?.message ?? 'We could not send your RFQ. Please try again.' }
  } catch {
    return { ok: false, message: 'We could not reach the server. Check your connection and try again.' }
  }
}
