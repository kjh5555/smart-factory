import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Production } from "@prisma/client";

interface ProductionDetailDialogProps {
  production: Production & {
    product: {
      id: string;
      name: string;
      description: string;
      baseQuantity: number;
      baseDays: number;
    };
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Equipment {
  id: string;
  name: string;
  type: string;
  location: string;
  sequence: number;
  status: 'OPERATING' | 'STANDBY';
  required: number;
}

interface ProductionEquipments {
  productName: string;
  equipments: Equipment[];
}

export function ProductionDetailDialog({
  production,
  open,
  onOpenChange,
}: ProductionDetailDialogProps) {
  // 해당 제품 생산에 사용되는 장비 목록 조회
  const { data, isLoading } = useQuery<ProductionEquipments>({
    queryKey: ['production-equipments', production.id],
    queryFn: () => axios.get(`/api/productions/${production.id}/equipments`).then(res => res.data),
    enabled: open, // 다이얼로그가 열릴 때만 데이터 조회
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPERATING':
        return <Badge className="bg-green-500">가동중</Badge>;
      case 'STANDBY':
        return <Badge variant="secondary">대기중</Badge>;
      default:
        return <Badge variant="outline">알 수 없음</Badge>;
    }
  };

  const getProductionStatusBadge = (status: string) => {
    const statusStyles = {
      PLANNED: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
      IN_PROGRESS: "bg-blue-100 text-blue-800 hover:bg-blue-200",
      COMPLETED: "bg-green-100 text-green-800 hover:bg-green-200",
      CANCELLED: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    } as const;
    
    const statusNames = {
      PLANNED: "생산 예정",
      IN_PROGRESS: "생산 중",
      COMPLETED: "생산 완료",
      CANCELLED: "생산 취소",
    } as const;

    return (
      <Badge variant="outline" className={statusStyles[status as keyof typeof statusStyles]}>
        {statusNames[status as keyof typeof statusNames]}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>생산 계획 상세 정보</DialogTitle>
          <DialogDescription>
            생산 계획의 상세 정보와 사용되는 장비 목록을 확인할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* 기본 정보 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2">제품 정보</h4>
              <div className="space-y-1">
                <p className="text-sm">제품명: {production.product.name}</p>
                <p className="text-sm">설명: {production.product.description}</p>
                <p className="text-sm">기준 수량: {production.product.baseQuantity}개</p>
                <p className="text-sm">기준 생산일: {production.product.baseDays}일</p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">생산 정보</h4>
              <div className="space-y-1">
                <p className="text-sm">생산 수량: {production.quantity}개</p>
                <p className="text-sm">시작일: {format(new Date(production.startTime), "yyyy-MM-dd HH:mm")}</p>
                <p className="text-sm">종료일: {format(new Date(production.endTime), "yyyy-MM-dd HH:mm")}</p>
                <p className="text-sm">상태: {getProductionStatusBadge(production.status)}</p>
              </div>
            </div>
          </div>

          {/* 장비 목록 */}
          <div>
            <h4 className="text-sm font-medium mb-2">사용 장비 목록</h4>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">장비 정보를 불러오는 중...</p>
            ) : data?.equipments && data.equipments.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">순서</TableHead>
                    <TableHead>장비명</TableHead>
                    <TableHead>설비 유형</TableHead>
                    <TableHead>위치</TableHead>
                    <TableHead className="w-[100px]">필요 수량</TableHead>
                    <TableHead className="w-[100px]">상태</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.equipments.map((equipment) => (
                    <TableRow key={equipment.id}>
                      <TableCell>{equipment.sequence}</TableCell>
                      <TableCell>{equipment.name}</TableCell>
                      <TableCell>{equipment.type}</TableCell>
                      <TableCell>{equipment.location}</TableCell>
                      <TableCell>{equipment.required}대</TableCell>
                      <TableCell>{getStatusBadge(equipment.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground">사용 중인 장비가 없습니다.</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 