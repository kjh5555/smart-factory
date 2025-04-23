import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 생산 계획 조회 (제품 정보와 할당된 장비 정보 포함)
    const production = await prisma.production.findUnique({
      where: { id: params.id },
      include: {
        product: {
          include: {
            equipmentTypes: {
              include: {
                equipmentType: true
              }
            }
          }
        },
        equipments: {
          include: {
            equipment: {
              include: {
                type: true,
                location: true
              }
            }
          },
          orderBy: {
            sequence: 'asc'
          }
        }
      }
    });

    if (!production) {
      return NextResponse.json(
        { error: "생산 계획을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 할당된 장비 정보를 가공하여 반환
    const equipments = production.equipments.map(pe => ({
      id: pe.equipment.id,
      name: pe.equipment.name,
      type: pe.equipment.type.name,
      location: pe.equipment.location.name,
      sequence: pe.sequence,
      status: pe.equipment.operationStatus,
      required: production.product.equipmentTypes.find(
        et => et.equipmentTypeId === pe.equipment.typeId
      )?.quantity || 1
    }));

    return NextResponse.json({
      productName: production.product.name,
      equipments
    });
  } catch (error) {
    console.error("생산 계획의 장비 목록 조회 중 오류 발생:", error);
    return NextResponse.json(
      { error: "생산 계획의 장비 목록을 조회하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
} 