"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";

interface QualityCheck {
  id: string;
  productName: string;
  batchNumber: string;
  inspector: string;
  result: 'PENDING' | 'PASSED' | 'FAILED' | 'NEEDS_REVIEW';
  checkDate: string;
  notes?: string;
}

export function QualityTable() {
  const { data: qualityChecks, isLoading } = useQuery<QualityCheck[]>({
    queryKey: ["quality-checks"],
    queryFn: async () => {
      const response = await axios.get("/api/quality-checks");
      return response.data;
    },
  });

  // 검사 결과에 따른 뱃지 스타일 설정
  const getResultBadge = (result: QualityCheck['result']) => {
    switch (result) {
      case 'PASSED':
        return <Badge className="bg-green-500">합격</Badge>;
      case 'FAILED':
        return <Badge variant="destructive">불합격</Badge>;
      case 'NEEDS_REVIEW':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">재검토 필요</Badge>;
      case 'PENDING':
      default:
        return <Badge variant="secondary">검사중</Badge>;
    }
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>제품명</TableHead>
            <TableHead>배치 번호</TableHead>
            <TableHead>검사자</TableHead>
            <TableHead>검사 일시</TableHead>
            <TableHead>결과</TableHead>
            <TableHead>비고</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {qualityChecks?.map((check) => (
            <TableRow key={check.id}>
              <TableCell>{check.productName}</TableCell>
              <TableCell>{check.batchNumber}</TableCell>
              <TableCell>{check.inspector}</TableCell>
              <TableCell>{format(new Date(check.checkDate), "yyyy-MM-dd HH:mm")}</TableCell>
              <TableCell>{getResultBadge(check.result)}</TableCell>
              <TableCell className="max-w-[200px] truncate">{check.notes || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 