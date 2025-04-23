'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, AlertTriangle } from "lucide-react";
import { useEquipment } from "@/hooks/useEquipment";
import { Status } from "@/types/equipment";

const getStatusBadge = (status: Status) => {
  switch (status) {
    case 'ACTIVE':
      return <Badge className="bg-green-500">가동 중</Badge>;
    case 'INACTIVE':
      return <Badge variant="secondary">미가동</Badge>;
    case 'MAINTENANCE':
      return <Badge variant="outline" className="border-yellow-500 text-yellow-500">점검 중</Badge>;
    case 'REPAIR':
      return <Badge variant="destructive">수리 중</Badge>;
    default:
      return <Badge variant="secondary">알 수 없음</Badge>;
  }
};

export default function EquipmentList() {
  const { data, isLoading, isError } = useEquipment();

  if (isLoading) {
    return <div className="text-center py-4">데이터를 불러오는 중...</div>;
  }

  if (isError) {
    return <div className="text-center py-4 text-red-500">데이터를 불러오는데 실패했습니다.</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>설비명</TableHead>
            <TableHead>유형</TableHead>
            <TableHead>상태</TableHead>
            <TableHead>위치</TableHead>
            <TableHead>최근 점검일</TableHead>
            <TableHead>다음 점검일</TableHead>
            <TableHead className="text-right">관리</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.equipments.map((equipment) => (
            <TableRow key={equipment.id}>
              <TableCell className="font-medium">{equipment.name}</TableCell>
              <TableCell>{equipment.type.name}</TableCell>
              <TableCell>{getStatusBadge(equipment.status)}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{equipment.location.name}</span>
                  {equipment.location.description && (
                    <span className="text-sm text-gray-500">{equipment.location.description}</span>
                  )}
                </div>
              </TableCell>
              <TableCell>{new Date(equipment.lastMaintenance).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {new Date(equipment.nextMaintenance).toLocaleDateString()}
                  {new Date(equipment.nextMaintenance) <= new Date() && (
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 