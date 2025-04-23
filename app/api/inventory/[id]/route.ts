import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

interface RouteParams {
  params: {
    id: string;
  };
}

// 특정 재고 항목 조회
export async function GET(request: Request, { params }: RouteParams) {
  const { id } = params;

  try {
    const inventory = await prisma.inventory.findUnique({
      where: { id },
    });

    if (!inventory) {
      return NextResponse.json(
        { error: "재고 항목을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 위치 정보 가져오기
    const location = await prisma.location.findUnique({
      where: { id: inventory.location },
    });

    // 위치 이름 추가
    const enrichedItem = {
      ...inventory,
      locationName: location ? location.name : inventory.location,
    };

    return NextResponse.json(enrichedItem);
  } catch (error) {
    console.error("재고 항목 조회 중 오류:", error);
    return NextResponse.json(
      { error: "재고 항목을 조회하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// 재고 항목 수정
export async function PUT(request: Request, { params }: RouteParams) {
  const { id } = params;
  
  try {
    const data = await request.json();
    
    // 필수 필드 검증
    if (!data.itemName || data.quantity === undefined || !data.location) {
      return NextResponse.json(
        { error: "필수 항목이 누락되었습니다." },
        { status: 400 }
      );
    }
    
    // 재고 항목 업데이트
    const updatedInventory = await prisma.inventory.update({
      where: { id },
      data: {
        itemName: data.itemName,
        quantity: parseInt(data.quantity),
        location: data.location,
        minQuantity: parseInt(data.minQuantity || 0),
        maxQuantity: parseInt(data.maxQuantity || 1000),
      },
    });
    
    return NextResponse.json(updatedInventory);
  } catch (error) {
    console.error("재고 항목 수정 중 오류:", error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json(
        { error: "재고 항목을 찾을 수 없습니다." },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: "재고 항목 수정 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// 재고 항목 삭제
export async function DELETE(request: Request, { params }: RouteParams) {
  const { id } = params;
  
  try {
    // 재고 항목 삭제
    await prisma.inventory.delete({
      where: { id },
    });
    
    return NextResponse.json({ message: "재고 항목이 삭제되었습니다." });
  } catch (error) {
    console.error("재고 항목 삭제 중 오류:", error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json(
        { error: "재고 항목을 찾을 수 없습니다." },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: "재고 항목 삭제 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
} 