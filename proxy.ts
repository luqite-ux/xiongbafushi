import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE } from '@/lib/admin-session'
import { PREVIEW_COOKIE } from '@/lib/site-content/site-content'
import { protectPreviewResponse } from '@/lib/site-content/preview-protection'
import { applyServiceExpiryGuard } from '@/service-guard-integration'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isPublic = pathname.startsWith('/admin/login') || pathname.startsWith('/admin/logout')
  if (!isPublic && pathname.startsWith('/admin') && !request.cookies.get(SESSION_COOKIE)?.value) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    url.searchParams.set('reason', 'unauthorized')
    const response = NextResponse.redirect(url)
    protectPreviewResponse(response.headers, request.cookies.has(PREVIEW_COOKIE))
    return response
  }
  const serviceGuardResponse = await applyServiceExpiryGuard(request)
  if (serviceGuardResponse) {
    protectPreviewResponse(serviceGuardResponse.headers, request.cookies.has(PREVIEW_COOKIE))
    return serviceGuardResponse
  }
  const response = NextResponse.next()
  protectPreviewResponse(response.headers, request.cookies.has(PREVIEW_COOKIE))
  return response
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?)$).*)'] }
