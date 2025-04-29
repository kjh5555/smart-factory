import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { PrismaClient, Prisma } from "@prisma/client";
import { Status } from "@prisma/client";

// any 타입 경고 억제를 위한 타입 주석 추가
// eslint-disable-next-line @typescript-eslint/no-explicit-any

const checkResultSchema = z.object({
  criteriaId: z.string(),
  value: z.union([z.string(), z.number()]),
  status: z.enum(["PASS", "FAIL"]),
  notes: z.string().optional(),
});

const qualityCheckSchema = z.object({
  standardId: z.string(),
  productionId: z.string().optional(),
  batchNumber: z.string(),
  inspector: z.string(),
  results: z.array(checkResultSchema),
  notes: z.string().optional(),
  images: z.array(z.string()).optional(),
});

// 'any' 타입을 구체적인 타입으로 변경
// 먼저 적절한 타입을 정의합니다
interface QualityCheckResult {
  criteriaId: string;
  value: string | number;
  status: "PASS" | "FAIL";
  notes?: string;
}

// GET /api/quality-checks - 품질 검사 목록 조회
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const standardId = searchParams.get("standardId");
    const productionId = searchParams.get("productionId");
    const status = searchParams.get("status") as QualityStatus | null;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;

    const where: any = {};
    if (standardId) where.standardId = standardId;
    if (productionId) where.productionId = productionId;
    if (status) where.status = status;

    const checks = await prisma.qualityCheck.findMany({
      where,
      include: {
        standard: {
          include: {
            product: true,
          },
        },
        production: true,
      },
      orderBy: [
        { checkDate: "desc" },
        { createdAt: "desc" }
      ],
      take: limit,
    });

    return NextResponse.json(checks);
  } catch (error) {
    console.error("품질 검사 목록 조회 중 오류 발생:", error);
    return NextResponse.json(
      { error: "품질 검사 목록을 조회하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// POST /api/quality-checks - 품질 검사 결과 등록
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = qualityCheckSchema.parse(body);

    // 품질 기준 존재 여부 확인
    const standard = await prisma.qualityStandard.findUnique({
      where: { id: validatedData.standardId },
    });

    if (!standard) {
      return NextResponse.json(
        { error: "품질 기준을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 전체 결과 상태 계산
    const failedResults = validatedData.results.filter(
      (result) => result.status === "FAIL"
    );
    const overallStatus = failedResults.length > 0 ? "FAILED" : "PASSED";

    // 품질 검사 결과 생성
    const qualityCheck = await prisma.qualityCheck.create({
      data: {
        standardId: validatedData.standardId,
        productionId: validatedData.productionId,
        batchNumber: validatedData.batchNumber,
        inspector: validatedData.inspector,
        checkDate: new Date(),
        results: validatedData.results as Prisma.JsonValue,
        status: overallStatus as QualityStatus,
        notes: validatedData.notes,
        images: validatedData.images || [],
      },
      include: {
        standard: {
          include: {
            product: true,
          },
        },
        production: true,
      },
    });

    return NextResponse.json(qualityCheck);
  } catch (error) {
    console.error("품질 검사 결과 등록 중 오류 발생:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "잘못된 입력 데이터입니다.", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "품질 검사 결과 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
} 