"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Activity, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";

interface QualityStats {
  total: number;
  passed: number;
  failed: number;
  needsReview: number;
  passRate: number;
}

export default function QualityMetrics() {
  const { data: stats } = useQuery<QualityStats>({
    queryKey: ["quality-stats"],
    queryFn: async () => {
      const response = await axios.get("/api/quality-checks/stats");
      return response.data;
    },
  });

  const metrics = [
    {
      title: "전체 검사",
      value: stats?.total || 0,
      icon: Activity,
      description: "총 품질 검사 건수",
    },
    {
      title: "합격률",
      value: `${stats?.passRate.toFixed(1) || 0}%`,
      icon: CheckCircle,
      description: "전체 검사 중 합격 비율",
    },
    {
      title: "불합격",
      value: stats?.failed || 0,
      icon: AlertCircle,
      description: "불합격 처리된 검사 건수",
    },
    {
      title: "재검토 필요",
      value: stats?.needsReview || 0,
      icon: RefreshCw,
      description: "재검토가 필요한 검사 건수",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {metric.title}
            </CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground">
              {metric.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 