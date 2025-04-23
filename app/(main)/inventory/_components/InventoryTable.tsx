"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash, Search, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import axios from "axios";
import EditInventoryForm from "./EditInventoryForm";
import { Inventory } from "@prisma/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// 인벤토리 타입 확장
interface ExtendedInventory extends Omit<Inventory, 'id'> {
  id: string;
  locationName?: string;
}

interface InventoryTableProps {
  inventoryItems: ExtendedInventory[];
  isLoading: boolean;
  onSuccess: () => void;
}

// 재고 상태 배지 생성 함수
const getStockStatusBadge = (current: number, min: number, max: number) => {
  if (current <= min) {
    return (
      <Badge variant="destructive" className="gap-1">
        <AlertTriangle className="h-3 w-3" />
        부족
      </Badge>
    );
  } else if (current >= max) {
    return (
      <Badge className="gap-1 bg-yellow-500 hover:bg-yellow-600">
        과다
      </Badge>
    );
  } else {
    return (
      <Badge variant="outline" className="gap-1">
        정상
      </Badge>
    );
  }
};

export function InventoryTable({ 
  inventoryItems, 
  isLoading,
  onSuccess
}: InventoryTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    itemId: string | null;
  }>({
    open: false,
    itemId: null,
  });
  const [editItem, setEditItem] = useState<ExtendedInventory | null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  // 검색어에 따라 필터링
  const filteredItems = inventoryItems ? inventoryItems.filter((item) =>
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.locationName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];
  
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  
  const paginatedInventories = filteredItems.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // 재고 편집 처리
  const handleEdit = (inventory: ExtendedInventory) => {
    setEditItem(inventory);
  };

  // 재고 삭제
  const handleDeleteItem = async () => {
    if (!deleteDialog.itemId) return;

    try {
      await axios.delete(`/api/inventory/${deleteDialog.itemId}`);
      toast.success("재고 항목이 삭제되었습니다.");
      onSuccess();
      setDeleteDialog({ open: false, itemId: null });
    } catch (error) {
      console.error("재고 삭제 오류:", error);
      toast.error("재고 항목 삭제 중 오류가 발생했습니다.");
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>재고 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>재고 목록</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="재고명 또는 위치 검색"
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">아이템 ID</TableHead>
                <TableHead>아이템명</TableHead>
                <TableHead>수량</TableHead>
                <TableHead>위치</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>최근 업데이트</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedInventories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    등록된 재고 아이템이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedInventories.map((inventory) => (
                  <TableRow key={inventory.id}>
                    <TableCell className="font-medium">
                      {inventory.id.substring(0, 8)}
                    </TableCell>
                    <TableCell>{inventory.itemName}</TableCell>
                    <TableCell>
                      {inventory.quantity.toLocaleString()}
                    </TableCell>
                    <TableCell>{inventory.locationName || inventory.location}</TableCell>
                    <TableCell>
                      {getStockStatusBadge(
                        inventory.quantity,
                        inventory.minQuantity,
                        inventory.maxQuantity
                      )}
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            {formatDistanceToNow(new Date(inventory.updatedAt), {
                              addSuffix: true,
                              locale: ko,
                            })}
                          </TooltipTrigger>
                          <TooltipContent>
                            {new Date(inventory.updatedAt).toLocaleString()}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(inventory)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => setDeleteDialog({ open: true, itemId: inventory.id })}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 삭제 확인 대화상자 */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open: boolean) => 
        setDeleteDialog({ ...deleteDialog, open })
      }>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>재고 항목 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              이 재고 항목을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteItem}>삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 수정 폼 대화상자 */}
      {editItem && (
        <EditInventoryForm
          item={editItem}
          open={!!editItem}
          onOpenChange={(open: boolean) => !open && setEditItem(null)}
          onSuccess={() => {
            setEditItem(null);
            onSuccess();
          }}
        />
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  );
} 