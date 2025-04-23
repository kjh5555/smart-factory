import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 제품과 필요한 설비 타입 조회
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        equipmentTypes: {
          include: {
            equipmentType: true
          },
          orderBy: {
            sequence: 'asc'
          }
        }
      }
    });

    if (!product) {
      return NextResponse.json(
        { error: "제품을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 필요한 설비 타입 목록 반환
    const requiredEquipmentTypes = product.equipmentTypes.map(pe => ({
      id: pe.equipmentType.id,
      name: pe.equipmentType.name,
      quantity: pe.quantity,
      sequence: pe.sequence
    }));

    return NextResponse.json(requiredEquipmentTypes);
  } catch (error) {
    console.error("제품의 필요 설비 타입 조회 중 오류 발생:", error);
    return NextResponse.json(
      { error: "제품의 필요 설비 타입을 조회하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
} 