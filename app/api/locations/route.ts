import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/locations - 위치 목록 조회
export async function GET() {
  try {
    // 모든 위치 정보 조회 (각 위치별 설비 수 포함)
    const locations = await prisma.location.findMany({
      include: {
        _count: {
          select: { equipments: true }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(locations);
  } catch (error) {
    console.error('위치 목록 조회 중 오류 발생:', error);
    return NextResponse.json(
      { error: '위치 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

// POST /api/locations - 위치 생성
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const location = await prisma.location.create({
      data: {
        name: body.name,
        description: body.description,
      }
    });

    return NextResponse.json(location);
  } catch (error) {
    console.error('위치 생성 중 오류 발생:', error);
    return NextResponse.json(
      { error: '위치 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
} 