import { Equipment, Status } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { MapPin, Wrench, Calendar, Activity } from "lucide-react";
import { OperationStatus } from "@/types/equipment";

interface LocationType {
  id: string;
  name: string;
  floor: number;
  zone: string;
}

// Omit을 사용하여 기존 location 필드를 제외하고 새로운 타입을 정의
interface EquipmentWithRelations extends Omit<Equipment, 'location'> {
  type: { id: string; name: string };
  location: LocationType;
  operationStatus: OperationStatus;
}

interface EquipmentTableProps {
  data: EquipmentWithRelations[];
}

export function EquipmentTable({ data }: EquipmentTableProps) {
  const getStatusBadge = (status: Status) => {
    const statusStyles = {
      ACTIVE: "bg-green-100 text-green-800 hover:bg-green-200",
      INACTIVE: "bg-gray-100 text-gray-800 hover:bg-gray-200",
      MAINTENANCE: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
      REPAIR: "bg-red-100 text-red-800 hover:bg-red-200",
    } as const;
    const statusNames = {
      ACTIVE: "가동중",
      INACTIVE: "미가동",
      MAINTENANCE: "점검중",
      REPAIR: "수리중",
    } as const;
    return (
      <Badge variant="outline" className={statusStyles[status]}>
        {statusNames[status]}
      </Badge>
    );
  };

  const getOperationStatusBadge = (status: OperationStatus) => {
    const statusStyles = {
      "OPERATING": "bg-blue-100 text-blue-800 hover:bg-blue-200",
      "STANDBY": "bg-gray-100 text-gray-800 hover:bg-gray-200",
    } as const;
    const statusNames = {
      "OPERATING": "작업중",
      "STANDBY": "작업대기중",
    } as const;
    return (
      <Badge variant="outline" className={statusStyles[status]}>
        {statusNames[status]}
      </Badge>
    );
  };

  const isMaintenanceNeeded = (nextMaintenance: Date) => {
    return new Date(nextMaintenance) <= new Date();
  };

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50">
          <TableHead className="w-[200px]">설비명</TableHead>
          <TableHead>유형</TableHead>
          <TableHead>위치</TableHead>
          <TableHead>상태</TableHead>
          <TableHead>작업상태</TableHead>
          <TableHead>마지막 점검일</TableHead>
          <TableHead>다음 점검일</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((equipment) => (
          <TableRow key={equipment.id} className="hover:bg-muted/50">
            <TableCell className="font-medium">{equipment.name}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-muted-foreground" />
                {equipment.type.name}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                {equipment.location.name}
              </div>
            </TableCell>
            <TableCell>{getStatusBadge(equipment.status)}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                {getOperationStatusBadge(equipment.operationStatus)}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {format(new Date(equipment.lastMaintenance), "yyyy.MM.dd", {
                  locale: ko,
                })}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Calendar className={`h-4 w-4 ${
                  isMaintenanceNeeded(equipment.nextMaintenance)
                    ? "text-red-500"
                    : "text-muted-foreground"
                }`} />
                <span className={
                  isMaintenanceNeeded(equipment.nextMaintenance)
                    ? "text-red-500 font-medium"
                    : ""
                }>
                  {format(new Date(equipment.nextMaintenance), "yyyy.MM.dd", {
                    locale: ko,
                  })}
                </span>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 