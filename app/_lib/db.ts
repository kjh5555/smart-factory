import { PrismaClient } from '@prisma/client';

// PrismaClient 인스턴스 생성
const prisma = new PrismaClient();

// 데이터베이스 연결 테스트 함수
export async function testConnection() {
  try {
    // 간단한 쿼리 실행으로 연결 테스트
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ 데이터베이스 연결 성공');
    return true;
  } catch (error) {
    console.error('❌ 데이터베이스 연결 실패:', error);
    return false;
  } finally {
    // 연결 종료
    await prisma.$disconnect();
  }
}

// 싱글톤 패턴으로 Prisma 클라이언트 export
export default prisma; 