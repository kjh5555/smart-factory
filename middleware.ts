import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 보호가 필요한 경로 패턴
const protectedPaths = [
  '/dashboard',
  '/profile',
  '/settings',
]

// 인증이 필요하지 않은 API 경로
const publicApiPaths = [
  '/api/auth/login',
  '/api/auth/register',
]

// 인증이 필요하지 않은 페이지 경로
const publicPaths = [
  '/',
  '/(auth)/login',
  '/(auth)/register',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // public 페이지는 통과 (하위 경로 포함)
  const isPublicPath = publicPaths.some(path => {
    // 라우트 그룹 패턴을 실제 URL과 매칭되도록 변환
    const normalizedPath = path.replace('(auth)', '')
    return pathname === '/' || pathname.startsWith(normalizedPath)
  })

  if (isPublicPath) {
    return NextResponse.next()
  }

  // API 요청 처리
  if (pathname.startsWith('/api/')) {
    // 공개 API 경로는 통과
    if (publicApiPaths.some(path => pathname.startsWith(path))) {
      return NextResponse.next()
    }

    // API 요청에 대한 토큰 검증
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      )
    }
  }

  // 보호된 페이지 요청 처리
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    const token = request.cookies.get('token')?.value
    
    if (!token) {
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('token')
      return response
    }
  }

  return NextResponse.next()
}

// 미들웨어가 실행될 경로 설정
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
} 