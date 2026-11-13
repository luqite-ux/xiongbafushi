import { NextResponse } from 'next/server'
import { siteConfig } from '@/lib/site'

export async function POST() {
  return NextResponse.json(
    {
      message: `Online RFQ submission is not available yet. Please email ${siteConfig.email} with your requirements.`,
    },
    { status: 501 },
  )
}
