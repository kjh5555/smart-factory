import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkEquipmentStatus() {
  try {
    // 운영 중인 설비 조회
    const operatingEquipments = await prisma.equipment.findMany({
      where: {
        operationStatus: 'OPERATING'
      },
      include: {
        type: true,
        location: true,
        productions: {
          include: {
            production: {
              include: {
                product: true
              }
            }
          }
        }
      }
    });

    console.log('\n운영 중인 설비 목록:');
    console.log('=============================================');
    console.log('설비명\t\t설비 유형\t\t생산 제품');
    console.log('=============================================');
    
    for (const equipment of operatingEquipments) {
      const productions = equipment.productions.map(pe => 
        pe.production.product.name
      ).join(', ');
      
      console.log(`${equipment.name}\t\t${equipment.type.name}\t\t${productions || '없음'}`);
    }
    
    console.log('\n');
    
    // 생산 중인 제품과 설비 현황 조회
    const inProgressProductions = await prisma.production.findMany({
      where: {
        status: 'IN_PROGRESS'
      },
      include: {
        product: true,
        equipments: {
          include: {
            equipment: {
              include: {
                type: true
              }
            }
          }
        }
      }
    });
    
    console.log('\n생산 중인 제품 목록:');
    console.log('=============================================');
    console.log('제품명\t\t할당된 설비\t\t설비 상태');
    console.log('=============================================');
    
    for (const production of inProgressProductions) {
      const equipments = await prisma.equipment.findMany({
        where: {
          productions: {
            some: {
              productionId: production.id
            }
          }
        },
        include: {
          type: true
        }
      });
      
      console.log(`${production.product.name}`);
      
      for (const equipment of equipments) {
        console.log(`\t\t${equipment.name} (${equipment.type.name})\t\t${equipment.operationStatus}`);
      }
      
      console.log('---------------------------------------------');
    }
    
  } catch (error) {
    console.error('설비 상태 조회 중 오류가 발생했습니다:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkEquipmentStatus(); 