import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/products - 제품 목록 조회
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('제품 목록 조회 중 오류 발생:', error);
    return NextResponse.json(
      { error: '제품 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

// POST /api/products - 제품 생성
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        baseQuantity: body.baseQuantity,
        baseDays: body.baseDays,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('제품 생성 중 오류 발생:', error);
    return NextResponse.json(
      { error: '제품 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
} 