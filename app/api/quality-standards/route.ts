import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

// 품질 기준 항목 스키마
const criteriaItemSchema = z.object({
  name: z.string(),
  type: z.enum(["NUMERIC", "VISUAL", "IMAGE"]),
  minValue: z.number().optional(),
  maxValue: z.number().optional(),
  unit: z.string().optional(),
  description: z.string(),
});

// 품질 기준 생성 스키마
const qualityStandardSchema = z.object({
  productId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  criteria: z.array(criteriaItemSchema),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = qualityStandardSchema.parse(body);

    // 제품 존재 여부 확인
    const product = await prisma.product.findUnique({
      where: { id: validatedData.productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "제품을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 품질 기준 생성
    const qualityStandard = await prisma.qualityStandard.create({
      data: {
        productId: validatedData.productId,
        name: validatedData.name,
        description: validatedData.description,
        criteria: validatedData.criteria,
      },
      include: {
        product: true,
      },
    });

    return NextResponse.json(qualityStandard);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "잘못된 입력 데이터입니다.", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "품질 기준 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    const where = productId ? { productId } : {};

    const standards = await prisma.qualityStandard.findMany({
      where,
      include: {
        product: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(standards);
  } catch (error) {
    return NextResponse.json(
      { error: "품질 기준 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
} 