import { NextResponse } from "next/server";

export async function POST() {
  try {
    // 응답 생성
    const response = NextResponse.json(
      { success: true, message: "로그아웃 되었습니다." },
      { status: 200 }
    );

    // 쿠키에서 토큰 제거
    response.cookies.delete({
      name: "token",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "로그아웃 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
} 