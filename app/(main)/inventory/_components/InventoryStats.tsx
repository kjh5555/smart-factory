"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PackageOpen, AlertTriangle, Check, Package } from "lucide-react";

interface InventoryItem {
  id: string;
  itemName: string;
  quantity: number;
  location: string;
  minQuantity: number;
  maxQuantity: number;
  createdAt: string;
  updatedAt: string;
}

interface InventoryStatsProps {
  inventoryItems?: InventoryItem[];
  isLoading: boolean;
}

export default function InventoryStats({ inventoryItems = [], isLoading }: InventoryStatsProps) {
  // 통계 계산
  const totalItems = inventoryItems.length;
  
  const lowStockItems = inventoryItems.filter(
    (item) => item.quantity <= item.minQuantity
  ).length;
  
  const optimalStockItems = inventoryItems.filter(
    (item) => item.quantity > item.minQuantity && item.quantity < item.maxQuantity
  ).length;
  
  const highStockItems = inventoryItems.filter(
    (item) => item.quantity >= item.maxQuantity
  ).length;

  // 통계 카드 렌더링 함수
  const renderStatCard = (
    title: string,
    value: number | string,
    description: string,
    icon: React.ReactNode,
    colorClass: string
  ) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`${colorClass} rounded-full p-2`}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isLoading ? <Skeleton className="h-8 w-20" /> : value}
        </div>
        <p className="text-xs text-muted-foreground pt-1">{description}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {renderStatCard(
        "총 재고 항목",
        totalItems,
        "등록된 전체 재고 항목 수",
        <Package className="h-4 w-4" />,
        "bg-blue-100 text-blue-700"
      )}
      
      {renderStatCard(
        "부족 재고",
        lowStockItems,
        "최소 수량 이하의 재고 항목",
        <AlertTriangle className="h-4 w-4" />,
        "bg-red-100 text-red-700"
      )}
      
      {renderStatCard(
        "적정 재고",
        optimalStockItems,
        "최적 범위 내의 재고 항목",
        <Check className="h-4 w-4" />,
        "bg-green-100 text-green-700"
      )}
      
      {renderStatCard(
        "충분 재고",
        highStockItems,
        "최대 수량 이상의 재고 항목",
        <PackageOpen className="h-4 w-4" />,
        "bg-yellow-100 text-yellow-700"
      )}
    </div>
  );
} 