import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Production } from "@prisma/client";
import { format } from "date-fns";
import { Eye } from "lucide-react";
import { useState } from "react";
import { ProductionDetailDialog } from "@/app/(main)/production/_components/ProductionDetailDialog";

interface ExtendedProduction extends Production {
  product: {
    id: string;
    name: string;
    description: string;
    baseQuantity: number;
    baseDays: number;
  };
  startTime: Date;
  endTime: Date;
}

interface ProductionTableProps {
  data: ExtendedProduction[];
}

export function ProductionTable({ data }: ProductionTableProps) {
  const [selectedProduction, setSelectedProduction] = useState<ExtendedProduction | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  type ProductionStatusType = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  
  const getStatusBadge = (status: ProductionStatusType) => {
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
      <Badge variant="outline" className={statusStyles[status]}>
        {statusNames[status]}
      </Badge>
    );
  };

  const handleDetailClick = (production: ExtendedProduction) => {
    setSelectedProduction(production);
    setDetailOpen(true);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>제품명</TableHead>
              <TableHead>수량</TableHead>
              <TableHead>시작일</TableHead>
              <TableHead>종료일</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>상세보기</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((production) => (
              <TableRow key={production.id}>
                <TableCell>{production.product.name}</TableCell>
                <TableCell>{production.quantity}</TableCell>
                <TableCell>
                  {format(new Date(production.startTime), "yyyy-MM-dd HH:mm")}
                </TableCell>
                <TableCell>
                  {format(new Date(production.endTime), "yyyy-MM-dd HH:mm")}
                </TableCell>
                <TableCell>{getStatusBadge(production.status as ProductionStatusType)}</TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDetailClick(production)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedProduction && (
        <ProductionDetailDialog
          production={selectedProduction}
          open={detailOpen}
          onOpenChange={setDetailOpen}
        />
      )}
    </>
  );
} 