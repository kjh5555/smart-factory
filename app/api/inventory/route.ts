import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Location, Inventory } from "@prisma/client";

// 모든 재고 항목 조회
export async function GET() {
  try {
    // 모든 재고 항목 가져오기
    const inventoryItems = await prisma.inventory.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    // 위치 정보 가져오기
    const locations = await prisma.location.findMany();
    
    // 위치 ID에 대한 위치 이름 매핑 생성
    const locationMap = new Map<string, string>();
    locations.forEach((location: Location) => {
      locationMap.set(location.id, location.name);
    });

    // 재고 항목에 위치 이름 추가
    const enrichedItems = inventoryItems.map((item: Inventory) => ({
      ...item,
      locationName: locationMap.get(item.location) || item.location,
    }));

    return NextResponse.json(enrichedItems);
  } catch (error) {
    console.error("재고 데이터 조회 중 오류:", error);
    return NextResponse.json(
      { error: "재고 데이터를 가져오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// 새 재고 항목 생성
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // 필수 필드 검증
    if (!data.itemName || data.quantity === undefined || !data.location) {
      return NextResponse.json(
        { error: "필수 항목이 누락되었습니다." },
        { status: 400 }
      );
    }

    // 재고 항목 생성
    const inventory = await prisma.inventory.create({
      data: {
        itemName: data.itemName,
        quantity: parseInt(data.quantity),
        location: data.location,
        minQuantity: parseInt(data.minQuantity || 0),
        maxQuantity: parseInt(data.maxQuantity || 1000),
      },
    });

    return NextResponse.json(inventory);
  } catch (error) {
    console.error("재고 항목 생성 중 오류:", error);
    return NextResponse.json(
      { error: "재고 항목 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
} 