import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateOperationStatus() {
  try {
    console.log('생산 중인 제품의 설비 상태 업데이트 시작...');
    
    // 진행 중인 모든 생산 계획 조회
    const inProgressProductions = await prisma.production.findMany({
      where: {
        status: 'IN_PROGRESS'
      },
      include: {
        product: true
      }
    });
    
    // 각 생산 계획별로 설비 상태 업데이트
    for (const production of inProgressProductions) {
      console.log(`${production.product.name} 생산에 할당된 설비 업데이트 중...`);
      
      // 이 생산에 할당된 모든 설비 찾기
      const productionEquipments = await prisma.productionEquipment.findMany({
        where: {
          productionId: production.id
        },
        include: {
          equipment: true
        }
      });
      
      for (const pe of productionEquipments) {
        // 설비 상태를 OPERATING으로 업데이트
        await prisma.equipment.update({
          where: {
            id: pe.equipmentId
          },
          data: {
            operationStatus: 'OPERATING'
          }
        });
        
        console.log(`설비 ${pe.equipment.name}의 상태를 OPERATING으로 변경했습니다.`);
      }
    }
    
    console.log('설비 상태 업데이트가 완료되었습니다.');
    
  } catch (error) {
    console.error('설비 상태 업데이트 중 오류가 발생했습니다:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateOperationStatus(); 