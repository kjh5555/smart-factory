'use client'

import { ReactNode } from 'react'
import { LayoutDashboard, Factory, Boxes, ClipboardCheck, BarChart3, LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'sonner'

interface MainLayoutProps {
  children: ReactNode
}

interface NavItem {
  title: string
  href: string
  icon: ReactNode
}

const navItems: NavItem[] = [
  {
    title: '대시보드',
    href: '/dashboard',
    icon: <LayoutDashboard className="w-6 h-6" />,
  },
  {
    title: '설비 관리',
    href: '/equipment',
    icon: <Factory className="w-6 h-6" />,
  },
  {
    title: '생산 관리',
    href: '/production',
    icon: <BarChart3 className="w-6 h-6" />,
  },
  {
    title: '품질 관리',
    href: '/quality',
    icon: <ClipboardCheck className="w-6 h-6" />,
  },
  {
    title: '재고 관리',
    href: '/inventory',
    icon: <Boxes className="w-6 h-6" />,
  },
]

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()

  // 로그아웃 함수 추가
  const handleLogout = async () => {
    try {
      // 서버에 로그아웃 요청 전송
      await axios.post('/api/auth/logout')
      
      // 성공 메시지 표시
      toast.success('로그아웃 되었습니다')
      
      // 로그인 페이지로 이동
      router.push('/login')
    } catch (error) {
      // 에러 처리
      console.error('로그아웃 실패:', error)
      toast.error('로그아웃 처리 중 오류가 발생했습니다')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 사이드바 */}
      <aside className="fixed left-0 top-0 w-64 h-full bg-white border-r border-gray-200">
        <div className="flex flex-col h-full">
          {/* 로고 */}
          <div className="h-16 flex items-center justify-center border-b border-gray-200">
            <h1 className="text-xl font-bold">공장</h1>
          </div>
          
          {/* 네비게이션 */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* 하단 로그아웃 버튼 */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors w-full"
            >
              <LogOut className="w-6 h-6" />
              <span>로그아웃</span>
            </button>
          </div>
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className="ml-64 min-h-screen">
        {children}
      </main>
    </div>
  )
} 