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
import { Badge } from "@/components/ui/badge";

interface QualityCheck {
  id: string;
  batchNumber: string;
  inspector: string;
  checkDate: string;
  status: "PENDING" | "PASSED" | "FAILED" | "NEEDS_REVIEW";
  standard: {
    product: {
      name: string;
    };
  };
}

const statusMap = {
  PENDING: { label: "검사중", variant: "secondary" },
  PASSED: { label: "합격", variant: "default" },
  FAILED: { label: "불합격", variant: "destructive" },
  NEEDS_REVIEW: { label: "재검토", variant: "outline" },
} as const;

export default function RecentChecks() {
  const { data: checks } = useQuery<QualityCheck[]>({
    queryKey: ["recent-checks"],
    queryFn: async () => {
      const response = await axios.get("/api/quality-checks?limit=5");
      return response.data;
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>최근 검사 결과</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>제품명</TableHead>
              <TableHead>배치번호</TableHead>
              <TableHead>검사자</TableHead>
              <TableHead>검사일시</TableHead>
              <TableHead>상태</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {checks?.map((check) => (
              <TableRow key={check.id}>
                <TableCell>{check.standard.product.name}</TableCell>
                <TableCell>{check.batchNumber}</TableCell>
                <TableCell>{check.inspector}</TableCell>
                <TableCell>
                  {format(new Date(check.checkDate), "yyyy-MM-dd HH:mm")}
                </TableCell>
                <TableCell>
                  <Badge variant={statusMap[check.status].variant}>
                    {statusMap[check.status].label}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 