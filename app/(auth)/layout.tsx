'use client'

import { usePathname } from 'next/navigation'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const title = pathname === '/login' ? '로그인' : '회원가입'

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex flex-col items-center justify-center min-h-screen py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            스마트 팩토리
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {title}하여 시스템을 이용하세요
          </p>
        </div>
        {children}
      </div>
    </div>
  )
} 