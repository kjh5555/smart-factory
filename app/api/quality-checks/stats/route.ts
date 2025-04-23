import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 전체 품질 검사 수 조회
    const totalChecks = await prisma.qualityCheck.count();

    // 상태별 품질 검사 수 조회 (raw query로 변경)
    const statusCountsRaw = await prisma.$queryRaw`
      SELECT status, COUNT(*) as count 
      FROM QualityCheck 
      GROUP BY status
    `;

    // 상태별 카운트를 객체로 변환
    const countsByStatus = {} as Record<string, number>;
    if (Array.isArray(statusCountsRaw)) {
      for (const row of statusCountsRaw) {
        if (row && typeof row === 'object' && 'status' in row && 'count' in row) {
          countsByStatus[row.status as string] = Number(row.count);
        }
      }
    }

    // 합격률 계산
    const passRate = totalChecks > 0 
      ? ((countsByStatus["PASSED"] || 0) / totalChecks * 100).toFixed(2)
      : "0.00";

    // 최근 실패한 검사 5개 조회 (raw query로 변경)
    const recentFailuresRaw = await prisma.$queryRaw`
      SELECT qc.*, qs.productId, p.name as productName
      FROM QualityCheck qc
      JOIN QualityStandard qs ON qc.standardId = qs.id
      JOIN Product p ON qs.productId = p.id
      WHERE qc.status = 'FAILED'
      ORDER BY qc.checkDate DESC
      LIMIT 5
    `;
    
    const recentFailures = Array.isArray(recentFailuresRaw) ? recentFailuresRaw : [];

    return NextResponse.json({
      totalChecks,
      countsByStatus,
      passRate: parseFloat(passRate),
      recentFailures,
    });
  } catch (error) {
    console.error("품질 검사 통계 조회 중 오류 발생:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `품질 검사 통계 조회 중 오류가 발생했습니다: ${error.message}` },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "품질 검사 통계 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
} 