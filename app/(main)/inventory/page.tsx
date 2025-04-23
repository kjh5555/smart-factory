"use client";

import PageTitle from "@/components/PageTitle";
import { InventoryTable } from "./_components/InventoryTable";
import InventoryStats from "./_components/InventoryStats";
import AddInventoryButton from "./_components/AddInventoryButton";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function InventoryPage() {
  // 재고 데이터 가져오기
  const { data: inventoryItems, isLoading, refetch } = useQuery({
    queryKey: ["inventory-items"],
    queryFn: async () => {
      const response = await axios.get("/api/inventory");
      return response.data;
    },
  });

  // 컴포넌트가 마운트될 때 데이터 새로고침
  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="space-y-6 p-6 pb-16">
      <div className="flex justify-between items-center">
        <PageTitle title="재고 관리" description="원자재 및 제품 재고를 관리합니다." />
        <AddInventoryButton onSuccess={() => refetch()} />
      </div>

      <InventoryStats inventoryItems={inventoryItems} isLoading={isLoading} />
      
      <InventoryTable inventoryItems={inventoryItems} isLoading={isLoading} onSuccess={() => refetch()} />
    </div>
  );
} 