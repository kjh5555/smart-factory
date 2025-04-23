"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { AlertTriangle, Clock, Wrench, Package } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";

// 알림 인터페이스 정의
interface Alert {
  id: string;
  type: 'inventory' | 'equipment' | 'production';
  message: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
  link?: string;
}

interface DashboardStats {
  equipment: {
    total: number;
    active: number;
    needsMaintenance: number;
    operating: number;
    standby: number;
  };
  production: {
    total: number;
    inProgress: number;
    completed: number;
    planned: number;
  };
  quality: {
    total: number;
    passed: number;
    failed: number;
    needsReview: number;
    passRate: string;
  };
  inventory: {
    total: number;
    lowStock: number;
    optimalStock: number;
    highStock: number;
  };
  updatedAt: string;
}

export default function RecentAlerts() {
  // 대시보드 통계 데이터 로드
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const response = await axios.get("/api/dashboard/stats");
      return response.data;
    },
  });

  // 알림 목록 생성
  const generateAlerts = (): Alert[] => {
    if (!stats) return [];
    
    const alerts: Alert[] = [];
    const now = new Date().toISOString();
    
    // 재고 부족 알림
    if (stats.inventory.lowStock > 0) {
      alerts.push({
        id: `inventory-low-${Date.now()}`,
        type: 'inventory',
        message: `${stats.inventory.lowStock}개 품목의 재고가 부족합니다.`,
        timestamp: now,
        priority: 'high',
        link: '/inventory'
      });
    }
    
    // 설비 점검 알림
    if (stats.equipment.needsMaintenance > 0) {
      alerts.push({
        id: `equipment-maintenance-${Date.now()}`,
        type: 'equipment',
        message: `${stats.equipment.needsMaintenance}대의 설비가 점검이 필요합니다.`,
        timestamp: now,
        priority: 'medium',
        link: '/equipment'
      });
    }
    
    // 진행 중인 생산 알림
    if (stats.production.inProgress > 0) {
      alerts.push({
        id: `production-progress-${Date.now()}`,
        type: 'production',
        message: `${stats.production.inProgress}건의 생산이 진행 중입니다.`,
        timestamp: now,
        priority: 'low',
        link: '/production'
      });
    }
    
    return alerts;
  };
  
  // 알림 생성
  const alerts = generateAlerts();
  
  // 알림 타입에 따른 아이콘 선택
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'inventory':
        return <Package className="h-4 w-4" />;
      case 'equipment':
        return <Wrench className="h-4 w-4" />;
      case 'production':
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };
  
  // 알림 우선순위에 따른 배지 스타일
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">긴급</Badge>;
      case 'medium':
        return <Badge variant="default">중요</Badge>;
      case 'low':
        return <Badge variant="outline">정보</Badge>;
      default:
        return <Badge variant="outline">정보</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">최근 알림</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-start space-x-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-24" />
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
        <CardTitle className="text-lg">최근 알림</CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>현재 알림이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-start space-x-4 pb-4 border-b last:border-b-0 last:pb-0">
                <div className="bg-muted p-2 rounded-full">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{alert.message}</span>
                    {getPriorityBadge(alert.priority)}
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(alert.timestamp), {
                            addSuffix: true,
                            locale: ko,
                          })}
                        </p>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">
                          {new Date(alert.timestamp).toLocaleString('ko-KR')}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 