import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/productions - 생산 계획 목록 조회
export async function GET() {
  try {
    // 현재 시간 기준으로 상태 업데이트
    const now = new Date();
    
    // PLANNED 상태이면서 시작 시간이 지난 생산을 IN_PROGRESS로 업데이트
    await prisma.production.updateMany({
      where: {
        status: "PLANNED",
        startTime: {
          lte: now,
        },
        endTime: {
          gt: now,
        },
      },
      data: {
        status: "IN_PROGRESS",
      },
    });

    // IN_PROGRESS 상태이면서 종료 시간이 지난 생산을 COMPLETED로 업데이트
    await prisma.production.updateMany({
      where: {
        status: "IN_PROGRESS",
        endTime: {
          lte: now,
        },
      },
      data: {
        status: "COMPLETED",
      },
    });

    // 생산 목록 조회
    const productions = await prisma.production.findMany({
      include: {
        product: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // 통계 계산
    const stats = {
      total: productions.length,
      inProgress: productions.filter(p => p.status === "IN_PROGRESS").length,
      completed: productions.filter(p => p.status === "COMPLETED").length,
      planned: productions.filter(p => p.status === "PLANNED").length,
    };

    return NextResponse.json({ productions, stats });
  } catch (error) {
    console.error("Failed to fetch productions:", error);
    return NextResponse.json(
      { error: "Failed to fetch productions" },
      { status: 500 }
    );
  }
}

// POST /api/productions - 생산 계획 생성
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 제품이 존재하는지 확인
    const product = await prisma.product.findUnique({
      where: { id: body.productId },
      include: {
        equipmentTypes: {
          include: {
            equipmentType: true
          }
        }
      }
    });

    if (!product) {
      return NextResponse.json(
        { error: '존재하지 않는 제품입니다.' },
        { status: 400 }
      );
    }

    // 필요한 설비 유형별로 STANDBY 상태인 설비 찾기
    const requiredEquipment = new Map();
    
    for (const equipmentType of product.equipmentTypes) {
      const availableEquipment = await prisma.equipment.findMany({
        where: {
          typeId: equipmentType.equipmentTypeId,
          operationStatus: 'STANDBY'
        },
        take: equipmentType.quantity
      });

      if (availableEquipment.length < equipmentType.quantity) {
        return NextResponse.json(
          { error: `필요한 ${equipmentType.equipmentType.name} 설비가 부족합니다.` },
          { status: 400 }
        );
      }

      requiredEquipment.set(equipmentType.equipmentTypeId, {
        equipment: availableEquipment,
        sequence: equipmentType.sequence
      });
    }

    // 트랜잭션으로 생산계획 생성 및 설비 상태 변경
    const production = await prisma.$transaction(async (tx) => {
      // 1. 생산 계획 생성
      const newProduction = await tx.production.create({
        data: {
          productId: body.productId,
          quantity: body.quantity,
          startTime: new Date(body.startTime),
          endTime: new Date(body.endTime),
          status: body.status,
        },
      });

      // 2. 설비 할당 및 상태 변경
      for (const [, { equipment: equipmentList, sequence }] of requiredEquipment) {
        for (const equipment of equipmentList) {
          // 설비 상태 변경
          await tx.equipment.update({
            where: { id: equipment.id },
            data: { operationStatus: 'OPERATING' }
          });

          // 생산-설비 관계 생성
          await tx.productionEquipment.create({
            data: {
              productionId: newProduction.id,
              equipmentId: equipment.id,
              sequence: sequence
            }
          });
        }
      }

      // 3. 생성된 생산 계획 조회 (관계 포함)
      const createdProduction = await tx.production.findUnique({
        where: { id: newProduction.id },
        include: {
          product: true,
          equipments: {
            include: {
              equipment: {
                include: {
                  type: true,
                  location: true
                }
              }
            }
          }
        }
      });

      // 4. 최신 생산 계획 목록과 통계 조회
      const productions = await tx.production.findMany({
        include: {
          product: true,
        },
        orderBy: {
          startTime: 'desc'
        }
      });

      const stats = {
        total: productions.length,
        inProgress: productions.filter(p => p.status === 'IN_PROGRESS').length,
        completed: productions.filter(p => p.status === 'COMPLETED').length,
        planned: productions.filter(p => p.status === 'PLANNED').length,
      };

      return {
        production: createdProduction,
        productions,
        stats
      };
    });

    return NextResponse.json(production);
  } catch (error) {
    console.error('생산 계획 생성 중 오류 발생:', error);
    return NextResponse.json(
      { error: '생산 계획 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
} 