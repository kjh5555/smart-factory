"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Eye, Cpu } from "lucide-react";
import { useState } from "react";
import ProductViewer from "./ProductViewer";
import HologramViewer from "./HologramViewer";

interface PendingReview {
  id: string;
  batchNumber: string;
  inspector: string;
  checkDate: string;
  notes: string | null;
  standard: {
    product: {
      name: string;
      id: string;
    };
  };
}

export default function PendingReviews() {
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isHologramOpen, setIsHologramOpen] = useState(false);

  const { data: reviews } = useQuery<PendingReview[]>({
    queryKey: ["pending-reviews"],
    queryFn: async () => {
      const response = await axios.get(
        "/api/quality-checks?status=NEEDS_REVIEW&limit=5"
      );
      return response.data;
    },
  });

  const handleViewProduct = (productId: string, productName: string) => {
    setSelectedProduct({ id: productId, name: productName });
    setIsViewerOpen(true);
  };

  const handleViewHologram = (productId: string, productName: string) => {
    setSelectedProduct({ id: productId, name: productName });
    setIsHologramOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>재검토 필요 항목</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>제품명</TableHead>
                <TableHead>배치번호</TableHead>
                <TableHead>검사자</TableHead>
                <TableHead>검사일시</TableHead>
                <TableHead>비고</TableHead>
                <TableHead className="w-[140px]">상세</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews?.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>{review.standard.product.name}</TableCell>
                  <TableCell>{review.batchNumber}</TableCell>
                  <TableCell>{review.inspector}</TableCell>
                  <TableCell>
                    {format(new Date(review.checkDate), "yyyy-MM-dd HH:mm")}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {review.notes}
                  </TableCell>
                  <TableCell className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewProduct(
                        review.standard.product.id,
                        review.standard.product.name
                      )}
                      title="3D 모델 보기"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewHologram(
                        review.standard.product.id,
                        review.standard.product.name
                      )}
                      title="홀로그램 뷰어"
                      className="text-blue-500"
                    >
                      <Cpu className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedProduct && (
        <>
          <ProductViewer
            productId={selectedProduct.id}
            productName={selectedProduct.name}
            open={isViewerOpen}
            onOpenChange={setIsViewerOpen}
          />
          <HologramViewer
            productId={selectedProduct.id}
            productName={selectedProduct.name}
            open={isHologramOpen}
            onOpenChange={setIsHologramOpen}
          />
        </>
      )}
    </>
  );
} 