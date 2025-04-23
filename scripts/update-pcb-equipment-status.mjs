import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updatePCBEquipmentStatus() {
  try {
    console.log('PCB 보드 생산 중인 설비 상태 업데이트 시작...');
    
    // PCB 보드 제품 ID 찾기
    const pcbBoard = await prisma.product.findFirst({
      where: {
        name: 'PCB 보드'
      }
    });
    
    if (!pcbBoard) {
      console.log('PCB 보드 제품을 찾을 수 없습니다.');
      return;
    }
    
    // PCB 보드의 진행 중인 생산 계획 찾기
    const production = await prisma.production.findFirst({
      where: {
        productId: pcbBoard.id,
        status: 'IN_PROGRESS'
      }
    });
    
    if (!production) {
      console.log('PCB 보드의 진행 중인 생산 계획을 찾을 수 없습니다.');
      
      // 상태가 PLANNED인 PCB 보드 생산 계획을 IN_PROGRESS로 변경
      const plannedProduction = await prisma.production.findFirst({
        where: {
          productId: pcbBoard.id,
          status: 'PLANNED'
        }
      });
      
      if (!plannedProduction) {
        console.log('PCB 보드의 PLANNED 상태 생산 계획을 찾을 수 없습니다.');
        return;
      }
      
      // 생산 상태를 IN_PROGRESS로 변경
      await prisma.production.update({
        where: {
          id: plannedProduction.id
        },
        data: {
          status: 'IN_PROGRESS'
        }
      });
      
      console.log(`PCB 보드 생산 계획 ${plannedProduction.id}의 상태를 IN_PROGRESS로 변경했습니다.`);
      
      // 이 생산에 할당된 설비 상태 변경
      const updatedEquipments = await prisma.equipment.updateMany({
        where: {
          ProductionEquipment: {
            some: {
              productionId: plannedProduction.id
            }
          }
        },
        data: {
          operationStatus: 'OPERATING'
        }
      });
      
      console.log(`${updatedEquipments.count}개의 설비 상태를 OPERATING으로 변경했습니다.`);
      return;
    }
    
    // 이 생산에 할당된 설비 찾기
    const productionEquipments = await prisma.productionEquipment.findMany({
      where: {
        productionId: production.id
      },
      include: {
        equipment: true
      }
    });
    
    if (productionEquipments.length === 0) {
      console.log(`생산 계획 ${production.id}에 할당된 설비가 없습니다.`);
      return;
    }
    
    // 각 설비의 상태를 OPERATING으로 변경
    for (const pe of productionEquipments) {
      await prisma.equipment.update({
        where: {
          id: pe.equipmentId
        },
        data: {
          operationStatus: 'OPERATING'
        }
      });
    }
    
    console.log(`${productionEquipments.length}개의 설비 상태를 OPERATING으로 변경했습니다.`);
    
  } catch (error) {
    console.error('설비 상태 업데이트 중 오류가 발생했습니다:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updatePCBEquipmentStatus(); 