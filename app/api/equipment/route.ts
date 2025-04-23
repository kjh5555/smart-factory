import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Status } from "@prisma/client";
import { z } from "zod";
import { OperationStatus } from "@/types/equipment";

// 입력 데이터 검증을 위한 스키마
const equipmentSchema = z.object({
  name: z.string().min(1, "설비 이름은 필수입니다."),
  typeId: z.string().min(1, "설비 유형은 필수입니다."),
  locationId: z.string().min(1, "설비 위치는 필수입니다."),
  status: z.enum(["ACTIVE", "INACTIVE", "MAINTENANCE", "REPAIR"]).default("ACTIVE"),
  operationStatus: z.enum(["OPERATING", "STANDBY"]).default("STANDBY"),
  lastMaintenance: z.string().min(1, "마지막 점검일은 필수입니다."),
  nextMaintenance: z.string().min(1, "다음 점검일은 필수입니다."),
});

// 설비 조회 시 포함할 관계 정의
const equipmentInclude = {
  type: true,
  location: true,
} as const;

export async function GET() {
  try {
    // 모든 설비 정보 조회 (type과 location 정보 포함)
    const equipments = await prisma.equipment.findMany({
      include: equipmentInclude,
    });

    // 통계 계산
    const totalEquipment = equipments.length;
    const activeEquipment = equipments.filter(
      (eq) => eq.status === Status.ACTIVE
    ).length;
    const needsMaintenance = equipments.filter(
      (eq) => eq.nextMaintenance < new Date()
    ).length;
    const operatingEquipment = equipments.filter(
      (eq) => eq.operationStatus === "OPERATING"
    ).length;
    const standbyEquipment = equipments.filter(
      (eq) => eq.operationStatus === "STANDBY"
    ).length;

    return NextResponse.json({
      equipments,
      stats: {
        total: totalEquipment,
        active: activeEquipment,
        needsMaintenance,
        operating: operatingEquipment,
        standby: standbyEquipment,
      },
    });
  } catch (error) {
    console.error("설비 조회 중 오류 발생:", error);
    return NextResponse.json(
      { error: "설비 정보를 조회하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // 데이터 유효성 검사
    const validatedData = equipmentSchema.parse(data);

    // 설비 유형 존재 여부 확인
    const equipmentType = await prisma.equipmentType.findUnique({
      where: { id: validatedData.typeId }
    });
    if (!equipmentType) {
      return NextResponse.json(
        { error: "존재하지 않는 설비 유형입니다." },
        { status: 400 }
      );
    }

    // 위치 존재 여부 확인
    const location = await prisma.location.findUnique({
      where: { id: validatedData.locationId }
    });
    if (!location) {
      return NextResponse.json(
        { error: "존재하지 않는 위치입니다." },
        { status: 400 }
      );
    }

    // 새로운 설비 생성
    const equipment = await prisma.equipment.create({
      data: {
        name: validatedData.name,
        typeId: validatedData.typeId,
        locationId: validatedData.locationId,
        status: validatedData.status as Status,
        operationStatus: validatedData.operationStatus,
        lastMaintenance: new Date(validatedData.lastMaintenance),
        nextMaintenance: new Date(validatedData.nextMaintenance),
      },
      include: equipmentInclude,
    });

    return NextResponse.json(equipment);
  } catch (error) {
    console.error("설비 생성 중 오류 발생:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "입력 데이터가 올바르지 않습니다.", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "설비를 생성하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
} 