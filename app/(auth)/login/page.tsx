'use client'

import LoginForm from './_components/LoginForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  return (
    <div className="container mx-auto max-w-md p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">로그인</CardTitle>
          <CardDescription className="text-center">
            스마트 팩토리 시스템에 오신 것을 환영합니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  )
} 