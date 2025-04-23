import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// 설비 유형 목록 (실제로는 DB에서 관리하는 것이 좋습니다)
const EQUIPMENT_TYPES = [
  { id: 'PRESS', name: '프레스' },
  { id: 'CONVEYOR', name: '컨베이어' },
  { id: 'ROBOT', name: '로봇' },
  { id: 'CNC', name: 'CNC 가공기' },
  { id: 'ASSEMBLY', name: '조립 라인' },
  { id: 'PACKAGING', name: '포장기' },
  { id: 'INSPECTION', name: '검사 장비' },
  { id: 'WELDING', name: '용접기' },
] as const;

export type EquipmentType = typeof EQUIPMENT_TYPES[number];

export async function GET() {
  try {
    const equipmentTypes = await prisma.equipmentType.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    
    return NextResponse.json(equipmentTypes);
  } catch (error) {
    console.error('설비 유형 조회 중 오류 발생:', error);
    return NextResponse.json(
      { error: '설비 유형을 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
} 