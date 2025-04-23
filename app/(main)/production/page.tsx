"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Production, ProductionStatus } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ClipboardList, PlayCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { ProductionTable } from "@/components/production/ProductionTable";
import AddProductionDialog from "./_components/AddProductionDialog";

interface ProductionStats {
  total: number;
  inProgress: number;
  completed: number;
  planned: number;
}

interface ProductionResponse {
  productions: Production[];
  stats: ProductionStats;
}

export default function ProductionPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // 생산 데이터 로드
  const { data: productionData, isLoading } = useQuery<ProductionResponse>({
    queryKey: ['productions'],
    queryFn: async () => {
      const { data } = await axios.get('/api/productions');
      return data;
    }
  });

  // 상태별 필터링된 생산 목록
  const filteredProductions = selectedStatus === "all"
    ? productionData?.productions ?? []
    : productionData?.productions.filter(prod => prod.status === selectedStatus) ?? [];

  const stats = productionData?.stats ?? {
    total: 0,
    inProgress: 0,
    completed: 0,
    planned: 0,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-2">
          <div className="text-lg font-medium">데이터를 불러오는 중...</div>
          <div className="text-sm text-muted-foreground">잠시만 기다려주세요.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 pb-16">
      <div className="flex justify-between items-center">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">생산 관리</h2>
          <p className="text-muted-foreground">
            생산 계획을 관리하고 현황을 모니터링합니다.
          </p>
        </div>
        <AddProductionDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체 생산</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}건</div>
            <p className="text-xs text-muted-foreground">
              총 생산 계획 수
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">생산 중</CardTitle>
            <PlayCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}건</div>
            <p className="text-xs text-muted-foreground">
              현재 진행 중인 생산
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">생산 완료</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}건</div>
            <p className="text-xs text-muted-foreground">
              완료된 생산
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">생산 예정</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.planned}건</div>
            <p className="text-xs text-muted-foreground">
              예정된 생산 계획
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border bg-card shadow-sm">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="text-lg font-medium">생산 목록</h3>
            <p className="text-sm text-muted-foreground">
              전체 생산 계획과 현황을 확인할 수 있습니다.
            </p>
          </div>
          <Select
            value={selectedStatus}
            onValueChange={setSelectedStatus}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="상태 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 상태</SelectItem>
              <SelectItem value="PLANNED">생산 예정</SelectItem>
              <SelectItem value="IN_PROGRESS">생산 중</SelectItem>
              <SelectItem value="COMPLETED">생산 완료</SelectItem>
              <SelectItem value="CANCELLED">생산 취소</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="p-4">
          <ProductionTable data={filteredProductions} />
        </div>
      </div>
    </div>
  );
} 