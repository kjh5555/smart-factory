"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Equipment } from "@prisma/client";
import { EquipmentTable } from "@/components/equipment/EquipmentTable";
import { Settings2, Activity, AlertTriangle, Play, Pause } from "lucide-react";
import AddEquipmentDialog from "./_components/AddEquipmentDialog";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface LocationType {
  id: string;
  name: string;
  floor: number;
  zone: string;
}

interface EquipmentWithRelations extends Omit<Equipment, 'location'> {
  type: { id: string; name: string };
  location: LocationType;
}

interface EquipmentStats {
  total: number;
  active: number;
  needsMaintenance: number;
  operating: number;
  standby: number;
}

interface EquipmentResponse {
  equipments: EquipmentWithRelations[];
  stats: EquipmentStats;
}

export default function EquipmentPage() {
  const [selectedLocation, setSelectedLocation] = useState<string>("all");

  // 설비 데이터 로드
  const { data: equipmentData, isLoading: isLoadingEquipment } = useQuery<EquipmentResponse>({
    queryKey: ['equipment'],
    queryFn: async () => {
      const { data } = await axios.get('/api/equipment');
      return data;
    }
  });

  // 위치 데이터 로드
  const { data: locations = [], isLoading: isLoadingLocations } = useQuery<LocationType[]>({
    queryKey: ['locations'],
    queryFn: async () => {
      const { data } = await axios.get('/api/locations');
      return data;
    }
  });

  // 위치별 필터링된 설비 목록
  const filteredEquipment = selectedLocation === "all"
    ? equipmentData?.equipments ?? []
    : equipmentData?.equipments.filter(eq => eq.location.id === selectedLocation) ?? [];

  const stats = equipmentData?.stats ?? {
    total: 0,
    active: 0,
    needsMaintenance: 0,
    operating: 0,
    standby: 0,
  };

  if (isLoadingEquipment || isLoadingLocations) {
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
          <h2 className="text-2xl font-bold tracking-tight">설비 관리</h2>
          <p className="text-muted-foreground">
            공장 내 모든 설비의 상태와 정보를 관리하고 모니터링합니다.
          </p>
        </div>
        <AddEquipmentDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체 설비</CardTitle>
            <Settings2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}대</div>
            <p className="text-xs text-muted-foreground">
              등록된 총 설비 수
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">가동 중인 설비</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}대</div>
            <p className="text-xs text-muted-foreground">
              현재 정상 작동 중인 설비
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">점검 필요 설비</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.needsMaintenance}대</div>
            <p className="text-xs text-muted-foreground">
              점검이 필요한 설비
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">작업중인 설비</CardTitle>
            <Play className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.operating}대</div>
            <p className="text-xs text-muted-foreground">
              현재 작업중인 설비
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">작업대기중 설비</CardTitle>
            <Pause className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.standby}대</div>
            <p className="text-xs text-muted-foreground">
              작업 대기중인 설비
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border bg-card shadow-sm">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="text-lg font-medium">설비 목록</h3>
            <p className="text-sm text-muted-foreground">
              전체 설비 목록과 상태를 확인할 수 있습니다.
            </p>
          </div>
          <Select
            value={selectedLocation}
            onValueChange={setSelectedLocation}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="위치 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 위치</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {location.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="p-4">
          <EquipmentTable data={filteredEquipment} />
        </div>
      </div>
    </div>
  );
} 