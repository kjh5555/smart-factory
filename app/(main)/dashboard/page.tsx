"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Factory,
  BarChart3,
  ClipboardCheck,
  Boxes,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCcw
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import RecentAlerts from "./_components/RecentAlerts";
import ActivityTimeline from "./_components/ActivityTimeline";
import CurrentProductionStatus from "./_components/CurrentProductionStatus";

// 대시보드 통계 데이터 인터페이스
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

export default function DashboardPage() {
  // 대시보드 통계 데이터 로드
  const { data: stats, isLoading, refetch } = useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const response = await axios.get("/api/dashboard/stats");
      return response.data;
    },
  });

  // 주기적으로 데이터 갱신 (1분마다)
  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, 60000);

    return () => clearInterval(intervalId);
  }, [refetch]);

  // 로딩 상태 렌더링
  if (isLoading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">대시보드</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-24 mb-2" />
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // 차트 데이터 생성
  const productionData = [
    { name: "진행중", value: stats?.production.inProgress || 0, color: "#3b82f6" },
    { name: "완료", value: stats?.production.completed || 0, color: "#10b981" },
    { name: "예정", value: stats?.production.planned || 0, color: "#f59e0b" },
  ];

  const inventoryData = [
    { name: "부족 재고", value: stats?.inventory.lowStock || 0, color: "#ef4444" },
    { name: "적정 재고", value: stats?.inventory.optimalStock || 0, color: "#22c55e" },
    { name: "충분 재고", value: stats?.inventory.highStock || 0, color: "#f59e0b" },
  ];

  const qualityData = [
    { name: "합격", value: stats?.quality.passed || 0, color: "#22c55e" },
    { name: "불합격", value: stats?.quality.failed || 0, color: "#ef4444" },
    { name: "검토 필요", value: stats?.quality.needsReview || 0, color: "#f59e0b" },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">대시보드</h1>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => refetch()}
          className="flex items-center gap-1"
        >
          <RefreshCcw className="h-4 w-4 mr-1" />
          새로고침
        </Button>
      </div>

      {/* 상단 카드 - 주요 지표 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">설비 현황</CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.equipment.total}대</div>
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle className="h-3 w-3" /> 정상 가동: {stats?.equipment.active}대 
              </span>
              <span className="flex items-center gap-1 text-amber-600">
                <AlertTriangle className="h-3 w-3" /> 점검 필요: {stats?.equipment.needsMaintenance}대
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">생산 현황</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.production.total}건</div>
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <span className="flex items-center gap-1 text-blue-600">
                <Clock className="h-3 w-3" /> 진행중: {stats?.production.inProgress}건
              </span>
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle className="h-3 w-3" /> 완료: {stats?.production.completed}건
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">품질 검사</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.quality.total}건</div>
            <div className="mt-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground flex justify-between">
                        <span>합격률</span>
                        <span className="font-medium">{stats?.quality.passRate}%</span>
                      </p>
                      <Progress 
                        value={Number(stats?.quality.passRate) || 0}
                        className="h-1.5"
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-xs space-y-1">
                      <p>합격: {stats?.quality.passed}건</p>
                      <p>불합격: {stats?.quality.failed}건</p>
                      <p>검토 필요: {stats?.quality.needsReview}건</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">재고 현황</CardTitle>
            <Boxes className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.inventory.total}개</div>
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <span className="flex items-center gap-1 text-amber-600">
                <AlertTriangle className="h-3 w-3" /> 부족: {stats?.inventory.lowStock}개
              </span>
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle className="h-3 w-3" /> 적정: {stats?.inventory.optimalStock}개
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 현재 생산 현황 */}
      <div className="mb-6">
        <CurrentProductionStatus />
      </div>

      {/* 차트 및 상세 데이터 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* 생산 현황 차트 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">생산 현황 분석</CardTitle>
            <CardDescription>
              생산 계획 상태별 비율
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="h-[400px] w-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={productionData}
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value, percent }) => 
                      value > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
                    labelLine={{ stroke: '#666', strokeWidth: 1, strokeDasharray: '', length: 10, angle: 45 }}
                  >
                    {productionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 품질 현황 차트 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">품질 검사 현황</CardTitle>
            <CardDescription>
              검사 결과별 비율
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="h-[400px] w-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={qualityData}
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value, percent }) => 
                      value > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
                    labelLine={{ stroke: '#666', strokeWidth: 1, strokeDasharray: '', length: 10, angle: 45 }}
                  >
                    {qualityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 재고 현황 차트 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">재고 상태 분석</CardTitle>
            <CardDescription>
              재고 상태별 비율
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="h-[400px] w-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={inventoryData}
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value, percent }) => 
                      value > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
                    labelLine={{ stroke: '#666', strokeWidth: 1, strokeDasharray: '', length: 10, angle: 45 }}
                  >
                    {inventoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 최근 알림 및 활동 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <RecentAlerts />
        <ActivityTimeline />
      </div>

      {/* 하단 정보 - 마지막 업데이트 시간 */}
      <div className="text-center text-xs text-muted-foreground mt-8">
        마지막 업데이트: {new Date(stats?.updatedAt || Date.now()).toLocaleString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })}
      </div>
    </div>
  );
} 