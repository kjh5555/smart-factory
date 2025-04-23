"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, Clock, Package2, Factory } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { ko } from "date-fns/locale";

// 생산 계획 인터페이스
interface Production {
  id: string;
  productId: string;
  quantity: number;
  startTime: string;
  endTime: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  product: {
    id: string;
    name: string;
  };
}

interface ProductionResponse {
  productions: Production[];
  stats: {
    total: number;
    inProgress: number;
    completed: number;
    planned: number;
  };
}

export default function CurrentProductionStatus() {
  // 생산 계획 데이터 로드
  const { data, isLoading } = useQuery<ProductionResponse>({
    queryKey: ["productions"],
    queryFn: async () => {
      const { data } = await axios.get("/api/productions");
      return data;
    },
  });

  // 진행 중인 생산 계획만 필터링
  const inProgressProductions = data?.productions.filter(
    prod => prod.status === 'IN_PROGRESS'
  ) || [];

  // 진행 상황 계산
  const calculateProgress = (startTime: string, endTime: string): number => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    // 시작 전이면 0%, 종료 후면 100%
    if (now < start) return 0;
    if (now > end) return 100;

    // 진행률 계산
    const totalDuration = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    return Math.round((elapsed / totalDuration) * 100);
  };

  // 남은 시간 표시
  const getTimeRemaining = (endTime: string): string => {
    const end = new Date(endTime);
    const now = new Date();
    
    if (now > end) return "완료됨";
    
    return formatDistanceToNow(end, {
      addSuffix: true,
      locale: ko,
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">현재 생산 현황</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-8 w-full" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">현재 생산 현황</CardTitle>
      </CardHeader>
      <CardContent>
        {inProgressProductions.length === 0 ? (
          <div className="text-center py-6 flex flex-col items-center gap-2 text-muted-foreground">
            <Factory className="h-10 w-10" />
            <p>현재 진행 중인 생산 계획이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {inProgressProductions.map((production) => {
              const progress = calculateProgress(production.startTime, production.endTime);
              
              return (
                <div key={production.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{production.product.name}</h3>
                    <span className="text-sm text-muted-foreground">ID: {production.id.substring(0, 8)}</span>
                  </div>
                  
                  <Progress value={progress} className="h-2" />
                  
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Package2 className="h-4 w-4" />
                      <span>수량: {production.quantity.toLocaleString()}개</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>남은 시간: {getTimeRemaining(production.endTime)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-xs text-muted-foreground">
                    <CalendarDays className="h-3 w-3 mr-1" />
                    <span>
                      {format(new Date(production.startTime), 'yyyy.MM.dd HH:mm')} ~ 
                      {format(new Date(production.endTime), 'yyyy.MM.dd HH:mm')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 