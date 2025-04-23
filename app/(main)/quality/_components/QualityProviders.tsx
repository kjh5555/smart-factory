'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

interface QualityProvidersProps {
  children: ReactNode;
}

export default function QualityProviders({ children }: QualityProvidersProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // 데이터를 자동으로 더 자주 리프레시하도록 설정
        staleTime: 1000 * 30, // 30초
        refetchInterval: 1000 * 60, // 1분마다 자동 리프레시
        // 화면에 포커스가 돌아올 때 자동으로 데이터 리프레시
        refetchOnWindowFocus: true,
      }
    }
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
} 