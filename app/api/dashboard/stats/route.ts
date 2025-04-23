import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * 대시보드용 통합 통계 API
 * - 설비 현황 (전체, 가동 중, 유지보수 필요)
 * - 생산 현황 (전체, 진행 중, 완료됨, 예정됨)
 * - 품질 검사 현황 (전체, 합격률, 검사별 상태)
 * - 재고 현황 (전체, 부족, 적정, 충분)
 */
export async function GET() {
  try {
    // 1. 설비 현황 통계
    const equipments = await prisma.equipment.findMany();
    const now = new Date();
    
    const equipmentStats = {
      total: equipments.length,
      active: equipments.filter(eq => eq.status === "ACTIVE").length,
      needsMaintenance: equipments.filter(eq => eq.nextMaintenance !== null && eq.nextMaintenance < now).length,
      operating: equipments.filter(eq => eq.operationStatus === "OPERATING").length,
      standby: equipments.filter(eq => eq.operationStatus === "STANDBY").length,
    };

    // 2. 생산 현황 통계
    // PLANNED 상태이면서 시작 시간이 지난 생산을 IN_PROGRESS로 업데이트
    await prisma.production.updateMany({
      where: {
        status: "PLANNED",
        startTime: { lte: now },
        endTime: { gt: now },
      },
      data: { status: "IN_PROGRESS" },
    });

    // IN_PROGRESS 상태이면서 종료 시간이 지난 생산을 COMPLETED로 업데이트
    await prisma.production.updateMany({
      where: {
        status: "IN_PROGRESS",
        endTime: { lte: now },
      },
      data: { status: "COMPLETED" },
    });

    // 생산 목록 조회
    const productions = await prisma.production.findMany({
      include: { product: true },
    });

    const productionStats = {
      total: productions.length,
      inProgress: productions.filter(p => p.status === "IN_PROGRESS").length,
      completed: productions.filter(p => p.status === "COMPLETED").length,
      planned: productions.filter(p => p.status === "PLANNED").length,
    };

    // 3. 품질 검사 현황
    const qualityChecks = await prisma.qualityCheck.findMany();
    const totalChecks = qualityChecks.length;
    
    const qualityStats = {
      total: totalChecks,
      passed: qualityChecks.filter(qc => qc.status === "PASSED").length,
      failed: qualityChecks.filter(qc => qc.status === "FAILED").length,
      needsReview: qualityChecks.filter(qc => qc.status === "NEEDS_REVIEW").length,
      passRate: totalChecks > 0 
        ? (qualityChecks.filter(qc => qc.status === "PASSED").length / totalChecks * 100).toFixed(2)
        : "0.00",
    };

    // 4. 재고 현황
    const inventoryItems = await prisma.inventory.findMany();
    
    const inventoryStats = {
      total: inventoryItems.length,
      lowStock: inventoryItems.filter(item => item.quantity <= item.minQuantity).length,
      optimalStock: inventoryItems.filter(
        item => item.quantity > item.minQuantity && item.quantity < item.maxQuantity
      ).length,
      highStock: inventoryItems.filter(item => item.quantity >= item.maxQuantity).length,
    };

    // 5. 통합 통계 반환
    return NextResponse.json({
      equipment: equipmentStats,
      production: productionStats,
      quality: qualityStats,
      inventory: inventoryStats,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("대시보드 통계 조회 중 오류 발생:", error);
    return NextResponse.json(
      { error: "대시보드 통계 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
} 