import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // DB에서 설비 유형 데이터 조회
    const equipmentTypes = await prisma.equipmentType.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(equipmentTypes);
  } catch (error) {
    console.error("설비 유형 조회 중 오류 발생:", error);
    return NextResponse.json(
      { error: "설비 유형 정보를 조회하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
} 