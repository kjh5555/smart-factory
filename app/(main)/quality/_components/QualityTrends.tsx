"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// API 응답 타입 정의
interface TrendsResponse {
  trends: {
    date: string;
    pass: number;
    fail: number;
    review: number;
  }[];
  productStats: {
    productName: string;
    total: number;
    fail: number;
    defectRate: number;
  }[];
}

// 차트에 사용할 데이터 타입
interface ChartData {
  date: string;
  passRate: number;
  totalChecks: number;
}

export default function QualityTrends() {
  const { data, isLoading } = useQuery<TrendsResponse>({
    queryKey: ["quality-trends"],
    queryFn: async () => {
      const response = await axios.get("/api/quality-checks/trends");
      return response.data;
    },
  });

  // API 데이터가 있을 경우 차트 데이터로 변환
  const chartData = data?.trends.map(item => {
    const total = item.pass + item.fail + item.review;
    const passRate = total > 0 ? Math.round((item.pass / total) * 100) : 0;
    return {
      date: item.date,
      passRate,
      totalChecks: total
    };
  }) || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>품질 검사 합격률 추이</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis
                  dataKey="date"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === "passRate") return [`${value}%`, "합격률"];
                    return [value, name];
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="passRate"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={true}
                  name="합격률"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>제품별 불량률</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>제품명</TableHead>
                <TableHead className="text-right">불량률</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.productStats.map((product) => (
                <TableRow key={product.productName}>
                  <TableCell>{product.productName}</TableCell>
                  <TableCell className="text-right font-medium">
                    {product.defectRate.toFixed(2)}%
                  </TableCell>
                </TableRow>
              ))}
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">로딩 중...</TableCell>
                </TableRow>
              )}
              {!isLoading && !data?.productStats.length && (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">데이터가 없습니다</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 