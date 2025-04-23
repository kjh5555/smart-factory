import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const equipmentTypes = [
  { id: 'PRESS', name: '프레스' },
  { id: 'CONVEYOR', name: '컨베이어' },
  { id: 'ROBOT', name: '로봇' },
  { id: 'CNC', name: 'CNC 가공기' },
  { id: 'ASSEMBLY', name: '조립 라인' },
  { id: 'PACKAGING', name: '포장기' },
  { id: 'INSPECTION', name: '검사 장비' },
  { id: 'WELDING', name: '용접기' },
];

const locations = [
  // 1층
  { id: 'F1-A', floor: 1, zone: 'A', name: '1층 A구역', description: '프레스 작업 구역' },
  { id: 'F1-B', floor: 1, zone: 'B', name: '1층 B구역', description: '조립 라인 구역' },
  { id: 'F1-C', floor: 1, zone: 'C', name: '1층 C구역', description: '포장 구역' },
  { id: 'F1-D', floor: 1, zone: 'D', name: '1층 D구역', description: '출하 구역' },
  
  // 2층
  { id: 'F2-A', floor: 2, zone: 'A', name: '2층 A구역', description: 'CNC 가공 구역' },
  { id: 'F2-B', floor: 2, zone: 'B', name: '2층 B구역', description: '용접 작업 구역' },
  { id: 'F2-C', floor: 2, zone: 'C', name: '2층 C구역', description: '로봇 작업 구역' },
  { id: 'F2-D', floor: 2, zone: 'D', name: '2층 D구역', description: '자재 보관 구역' },
  
  // 3층
  { id: 'F3-A', floor: 3, zone: 'A', name: '3층 A구역', description: '품질 검사 구역' },
  { id: 'F3-B', floor: 3, zone: 'B', name: '3층 B구역', description: '사무실 구역' },
  { id: 'F3-C', floor: 3, zone: 'C', name: '3층 C구역', description: '회의실 구역' },
  { id: 'F3-D', floor: 3, zone: 'D', name: '3층 D구역', description: '휴게 구역' },
];

const equipments = [
  // PRESS
  { id: 'PRESS-001', name: '프레스기 001', status: 'ACTIVE', typeId: 'PRESS', locationId: 'F1-A', operationStatus: 'STANDBY',lastMaintenance: new Date('2025-04-15T09:30:00.000'),nextMaintenance: new Date('2025-04-25T09:30:00.000') },
  { id: 'PRESS-002', name: '프레스기 002', status: 'ACTIVE', typeId: 'PRESS', locationId: 'F1-A', operationStatus: 'STANDBY',lastMaintenance: new Date('2025-04-25T09:30:00.000'),nextMaintenance: new Date('2025-04-25T09:30:00.000') },
  { id: 'PRESS-003', name: '프레스기 003', status: 'ACTIVE', typeId: 'PRESS', locationId: 'F1-A', operationStatus: 'STANDBY',lastMaintenance: new Date('2025-04-26T09:30:00.000'),nextMaintenance: new Date('2025-04-25T09:30:00.000') },
  { id: 'PRESS-004', name: '프레스기 004', status: 'ACTIVE', typeId: 'PRESS', locationId: 'F1-A', operationStatus: 'STANDBY',lastMaintenance: new Date('2025-04-30T09:30:00.000'),nextMaintenance: new Date('2025-04-25T09:30:00.000') },

  // CONVEYOR
  { id: 'CONVEYOR-001', name: '컨베이어 001', status: 'ACTIVE', typeId: 'CONVEYOR', locationId: 'F2-A', operationStatus: 'STANDBY' ,lastMaintenance: new Date('2025-04-17T09:30:00.000'),nextMaintenance: new Date('2025-04-25T09:30:00.000')},
  { id: 'CONVEYOR-002', name: '컨베이어 002', status: 'ACTIVE', typeId: 'CONVEYOR', locationId: 'F2-A', operationStatus: 'STANDBY' ,lastMaintenance: new Date('2025-04-19T09:30:00.000'),nextMaintenance: new Date('2025-04-25T09:30:00.000')},
  { id: 'CONVEYOR-003', name: '컨베이어 003', status: 'ACTIVE', typeId: 'CONVEYOR', locationId: 'F2-A', operationStatus: 'STANDBY' ,lastMaintenance: new Date('2025-04-13T09:30:00.000'),nextMaintenance: new Date('2025-04-25T09:30:00.000')},
  { id: 'CONVEYOR-004', name: '컨베이어 004', status: 'ACTIVE', typeId: 'CONVEYOR', locationId: 'F2-A', operationStatus: 'STANDBY' ,lastMaintenance: new Date('2025-04-11T09:30:00.000'),nextMaintenance: new Date('2025-04-25T09:30:00.000')},

  // ROBOT
  { id: 'ROBOT-001', name: '로봇 001', status: 'ACTIVE', typeId: 'ROBOT', locationId: 'F2-B', operationStatus: 'STANDBY' ,lastMaintenance: new Date('2025-04-17T09:30:00.000'),nextMaintenance: new Date('2025-04-25T09:30:00.000')},
  { id: 'ROBOT-002', name: '로봇 002', status: 'ACTIVE', typeId: 'ROBOT', locationId: 'F2-B', operationStatus: 'STANDBY' ,lastMaintenance: new Date('2025-04-22T09:30:00.000'),nextMaintenance: new Date('2025-04-25T09:30:00.000')},
  { id: 'ROBOT-003', name: '로봇 003', status: 'ACTIVE', typeId: 'ROBOT', locationId: 'F2-B', operationStatus: 'STANDBY' ,lastMaintenance: new Date('2025-04-20T09:30:00.000'),nextMaintenance: new Date('2025-04-25T09:30:00.000')},
  { id: 'ROBOT-004', name: '로봇 004', status: 'ACTIVE', typeId: 'ROBOT', locationId: 'F2-B', operationStatus: 'STANDBY' ,lastMaintenance: new Date('2025-04-21T09:30:00.000'),nextMaintenance: new Date('2025-04-25T09:30:00.000')},

  // CNC
  { id: 'CNC-001', name: 'CNC 가공기 001', status: 'ACTIVE', typeId: 'CNC', locationId: 'F2-C', operationStatus: 'STANDBY' ,lastMaintenance: new Date('2025-04-22T09:30:00.000'),nextMaintenance: new Date('2025-04-25T09:30:00.000')},
  { id: 'CNC-002', name: 'CNC 가공기 002', status: 'ACTIVE', typeId: 'CNC', locationId: 'F2-C', operationStatus: 'STANDBY' ,lastMaintenance: new Date('2025-04-22T09:30:00.000'),nextMaintenance: new Date('2025-04-25T09:30:00.000')},
  { id: 'CNC-003', name: 'CNC 가공기 003', status: 'ACTIVE', typeId: 'CNC', locationId: 'F2-C', operationStatus: 'STANDBY' ,lastMaintenance: new Date('2025-04-22T09:30:00.000'),nextMaintenance: new Date('2025-04-25T09:30:00.000')},
  { id: 'CNC-004', name: 'CNC 가공기 004', status: 'ACTIVE', typeId: 'CNC', locationId: 'F2-C', operationStatus: 'STANDBY' ,lastMaintenance: new Date('2025-04-22T09:30:00.000'),nextMaintenance: new Date('2025-04-25T09:30:00.000')},

  // ASSEMBLY
  { id: 'ASSEMBLY-001', name: '조립라인 001', status: 'ACTIVE', typeId: 'ASSEMBLY', locationId: 'F1-B', operationStatus: 'STANDBY' ,lastMaintenance: new Date('2025-04-22T09:30:00.000'),nextMaintenance: new Date('2025-04-25T09:30:00.000')},
  { id: 'ASSEMBLY-002', name: '조립라인 002', status: 'ACTIVE', typeId: 'ASSEMBLY', locationId: 'F1-B', operationStatus: 'STANDBY' ,lastMaintenance: new Date('2025-04-22T09:30:00.000'),nextMaintenance: new Date('2025-04-25T09:30:00.000')},
  { id: 'ASSEMBLY-003', name: '조립라인 003', status: 'ACTIVE', typeId: 'ASSEMBLY', locationId: 'F1-B', operationStatus: 'STANDBY' ,lastMaintenance: new Date('2025-04-22T09:30:00.000'),nextMaintenance: new Date('2025-04-25T09:30:00.000')},
  { id: 'ASSEMBLY-004', name: '조립라인 004', status: 'ACTIVE', typeId: 'ASSEMBLY', locationId: 'F1-B', operationStatus: 'STANDBY' ,lastMaintenance: new Date('2025-04-22T09:30:00.000'),nextMaintenance: new Date('2025-04-25T09:30:00.000')},

  // PACKAGING
  { id: 'PACKAGING-001', name: '포장기 001', status: 'ACTIVE', typeId: 'PACKAGING', locationId: 'F1-C', operationStatus: 'STANDBY' ,lastMaintenance: new Date('2025-04-22T09:30:00.000'),nextMaintenance: new Date('2025-04-25T09:30:00.000')},
  { id: 'PACKAGING-002', name: '포장기 002', status: 'ACTIVE', typeId: 'PACKAGING', locationId: 'F1-C', operationStatus: 'STANDBY' ,lastMaintenance: new Date('2025-04-22T09:30:00.000'),nextMaintenance: new Date('2025-04-25T09:30:00.000')},
  { id: 'PACKAGING-003', name: '포장기 003', status: 'ACTIVE', typeId: 'PACKAGING', locationId: 'F1-C', operationStatus: 'STANDBY' ,lastMaintenance: new Date('2025-04-22T09:30:00.000'),nextMaintenance: new Date('2025-04-25T09:30:00.000')},
  { id: 'PACKAGING-004', name: '포장기 004', status: 'ACTIVE', typeId: 'PACKAGING', locationId: 'F1-C', operationStatus: 'STANDBY' ,lastMaintenance: new Date('2025-04-22T09:30:00.000'),nextMaintenance: new Date('2025-04-25T09:30:00.000')},

  // INSPECTION
  { id: 'INSPECTION-001', name: '검사 장비 001', status: 'ACTIVE', typeId: 'INSPECTION', locationId: 'F3-A', operationStatus: 'STANDBY' ,lastMaintenance: new Date('2025-04-22T09:30:00.000'),nextMaintenance: new Date('2025-04-25T09:30:00.000')},
  { id: 'INSPECTION-002', name: '검사 장비 002', status: 'ACTIVE', typeId: 'INSPECTION', locationId: 'F3-A', operationStatus: 'STANDBY' ,lastMaintenance: new Date('2025-04-22T09:30:00.000'),nextMaintenance: new Date('2025-04-25T09:30:00.000')},
  { id: 'INSPECTION-003', name: '검사 장비 003', status: 'ACTIVE', typeId: 'INSPECTION', locationId: 'F3-A', operationStatus: 'STANDBY' ,lastMaintenance: new Date('2025-04-22T09:30:00.000'),nextMaintenance: new Date('2025-04-25T09:30:00.000')},
  { id: 'INSPECTION-004', name: '검사 장비 004', status: 'ACTIVE', typeId: 'INSPECTION', locationId: 'F3-A', operationStatus: 'STANDBY' ,lastMaintenance: new Date('2025-04-22T09:30:00.000'),nextMaintenance: new Date('2025-04-25T09:30:00.000')},

  // WELDING
  { id: 'WELDING-001', name: '용접기 001', status: 'ACTIVE', typeId: 'WELDING', locationId: 'F2-D', operationStatus: 'STANDBY' ,lastMaintenance: new Date('2025-04-22T09:30:00.000'),nextMaintenance: new Date('2025-04-25T09:30:00.000')},
  { id: 'WELDING-002', name: '용접기 002', status: 'ACTIVE', typeId: 'WELDING', locationId: 'F2-D', operationStatus: 'STANDBY' ,lastMaintenance: new Date('2025-04-22T09:30:00.000'),nextMaintenance: new Date('2025-04-25T09:30:00.000')},
  { id: 'WELDING-003', name: '용접기 003', status: 'ACTIVE', typeId: 'WELDING', locationId: 'F2-D', operationStatus: 'STANDBY' ,lastMaintenance: new Date('2025-04-22T09:30:00.000'),nextMaintenance: new Date('2025-04-25T09:30:00.000')},
  { id: 'WELDING-004', name: '용접기 004', status: 'ACTIVE', typeId: 'WELDING', locationId: 'F2-D', operationStatus: 'STANDBY' ,lastMaintenance: new Date('2025-04-22T09:30:00.000'),nextMaintenance: new Date('2025-04-25T09:30:00.000')},
];

async function main() {
  console.log('시드 데이터 생성 시작...');

  // 기존 데이터 삭제 (순서 중요)
  await prisma.qualityCheck.deleteMany();
  await prisma.qualityStandard.deleteMany();
  await prisma.productionEquipment.deleteMany();
  await prisma.production.deleteMany();
  await prisma.productEquipment.deleteMany();
  await prisma.equipment.deleteMany();
  await prisma.product.deleteMany();
  await prisma.location.deleteMany();
  await prisma.equipmentType.deleteMany();
  await prisma.inventory.deleteMany();

  // 설비 유형 생성
  console.log('설비 유형 데이터 생성 중...');
  for (const type of equipmentTypes) {
    await prisma.equipmentType.create({
      data: {
        id: type.id,
        name: type.name,
      }
    });
  }

  // 위치 생성
  console.log('위치 데이터 생성 중...');
  for (const location of locations) {
    await prisma.location.create({
      data: {
        id: location.id,
        name: location.name,
        description: location.description,
      }
    });
  }

  // 제품 생성
  console.log('제품 데이터 생성 중...');
  const products = [
    {
      name: 'PCB 보드',
      description: '전자 회로 기판',
      baseQuantity: 1000,
      baseDays: 3,
      equipmentTypes: [
        { typeId: 'ROBOT', quantity: 2, sequence: 1 },
        { typeId: 'CNC', quantity: 2, sequence: 2 },
        { typeId: 'INSPECTION', quantity: 1, sequence: 3 }
      ]
    },
    {
      name: '센서 모듈',
      description: '온도/습도 감지 센서',
      baseQuantity: 1000,
      baseDays: 2,
      equipmentTypes: [
        { typeId: 'PRESS', quantity: 1, sequence: 1 },
        { typeId: 'ROBOT', quantity: 1, sequence: 2 },
        { typeId: 'INSPECTION', quantity: 1, sequence: 3 }
      ]
    },
    {
      name: '배터리 팩',
      description: '리튬이온 배터리 패키지',
      baseQuantity: 1000,
      baseDays: 4,
      equipmentTypes: [
        { typeId: 'ASSEMBLY', quantity: 2, sequence: 1 },
        { typeId: 'ROBOT', quantity: 1, sequence: 2 },
        { typeId: 'INSPECTION', quantity: 1, sequence: 3 }
      ]
    },
    {
      name: '디스플레이 패널',
      description: 'LCD 디스플레이 모듈',
      baseQuantity: 1000,
      baseDays: 5,
      equipmentTypes: [
        { typeId: 'ROBOT', quantity: 2, sequence: 1 },
        { typeId: 'ASSEMBLY', quantity: 2, sequence: 2 },
        { typeId: 'INSPECTION', quantity: 1, sequence: 3 }
      ]
    },
    {
      name: '케이스 어셈블리',
      description: '제품 외장 케이스',
      baseQuantity: 1000,
      baseDays: 2,
      equipmentTypes: [
        { typeId: 'PRESS', quantity: 2, sequence: 1 },
        { typeId: 'WELDING', quantity: 1, sequence: 2 },
        { typeId: 'INSPECTION', quantity: 1, sequence: 3 }
      ]
    },
  ];

  const createdProducts = [];
  for (const product of products) {
    const { equipmentTypes, ...productData } = product;
    const createdProduct = await prisma.product.create({
      data: {
        ...productData,
        equipmentTypes: {
          create: equipmentTypes.map(et => ({
            equipmentType: {
              connect: { id: et.typeId }
            },
            quantity: et.quantity,
            sequence: et.sequence
          }))
        }
      }
    });
    createdProducts.push(createdProduct);
  }

  // 설비 생성
  console.log('설비 데이터 생성 중...');
  for (const equipment of equipments) {
    await prisma.equipment.create({
      data: equipment
    });
  }

  // 생산 계획 생성
  console.log('생산 계획 데이터 생성 중...');
  const today = new Date();
  
  const productions = [
    {
      product: createdProducts[0], // PCB 보드
      quantity: 2000,
      startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5),
      endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
      status: 'IN_PROGRESS'
    },
    {
      product: createdProducts[1], // 센서 모듈
      quantity: 1500,
      startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2),
      endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
      status: 'PLANNED'
    },
    {
      product: createdProducts[2], // 배터리 팩
      quantity: 3000,
      startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 10),
      endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5),
      status: 'COMPLETED'
    }
  ];

  // 생산 계획 및 설비 할당
  const createdProductions = [];
  for (const prodData of productions) {
    const { product, ...productionData } = prodData;
    
    // 생산 계획 생성
    const production = await prisma.production.create({
      data: {
        productId: product.id,
        ...productionData
      }
    });
    createdProductions.push(production);
    
    // 설비 할당 (제품에 필요한 설비 유형별로 할당)
    const productEquipments = await prisma.productEquipment.findMany({
      where: { productId: product.id },
      include: { equipmentType: true }
    });
    
    for (const pe of productEquipments) {
      // 해당 유형의 가용 설비 중 첫 번째 설비를 할당
      const availableEquipment = await prisma.equipment.findFirst({
        where: { 
          typeId: pe.equipmentTypeId,
          status: 'ACTIVE'
        }
      });
      
      if (availableEquipment) {
        await prisma.productionEquipment.create({
          data: {
            productionId: production.id,
            equipmentId: availableEquipment.id,
            sequence: pe.sequence
          }
        });
        
        // 생산 중인 상태이면 설비 상태를 OPERATING으로 변경
        if (productionData.status === 'IN_PROGRESS') {
          await prisma.equipment.update({
            where: {
              id: availableEquipment.id
            },
            data: {
              operationStatus: 'OPERATING'
            }
          });
          console.log(`설비 ${availableEquipment.name}의 상태를 OPERATING으로 변경했습니다.`);
        }
      }
    }
  }

  // 품질 기준 생성
  console.log('품질 기준 데이터 생성 중...');
  const qualityStandards = [];
  
  for (const product of createdProducts) {
    const standard = await prisma.qualityStandard.create({
      data: {
        productId: product.id,
        name: `${product.name} 품질 기준`,
        description: `${product.name}의 기본 품질 검사 기준입니다.`,
        criteria: [
          {
            id: "1",
            name: "외관 검사",
            type: "VISUAL",
            description: "제품 외관에 흠집이나 오염이 없어야 함",
          },
          {
            id: "2",
            name: "치수 검사",
            type: "NUMERIC",
            minValue: 95,
            maxValue: 105,
            unit: "mm",
            description: "제품 치수가 기준 범위 내에 있어야 함",
          },
          {
            id: "3",
            name: "전기적 검사",
            type: "BOOLEAN",
            description: "전기적 특성이 정상 동작해야 함",
          }
        ],
      }
    });
    qualityStandards.push(standard);
  }

  // 품질 검사 데이터 생성
  console.log('품질 검사 데이터 생성 중...');
  const statuses = ['PASSED', 'FAILED', 'NEEDS_REVIEW', 'PENDING'];
  
  // 각 품질 기준에 대해 검사 결과 생성
  for (let i = 0; i < qualityStandards.length; i++) {
    const standard = qualityStandards[i];
    
    // 각 기준마다 5-10개의 검사 데이터 생성
    for (let j = 0; j < 5 + Math.floor(Math.random() * 5); j++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - j);
      
      // 무작위 상태 선택
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      // 검사 결과 생성
      const results = [
        {
          criteriaId: "1",
          value: Math.random() > 0.2 ? "적합" : "부적합",
          status: Math.random() > 0.2 ? "PASS" : "FAIL",
          notes: "외관 검사 결과"
        },
        {
          criteriaId: "2",
          value: 95 + Math.floor(Math.random() * 15),
          status: Math.random() > 0.2 ? "PASS" : "FAIL",
          notes: "치수 검사 결과"
        },
        {
          criteriaId: "3",
          value: Math.random() > 0.2,
          status: Math.random() > 0.2 ? "PASS" : "FAIL",
          notes: "전기적 검사 결과"
        }
      ];
      
      await prisma.qualityCheck.create({
        data: {
          standardId: standard.id,
          productionId: i < createdProductions.length ? createdProductions[i].id : null,
          batchNumber: `BATCH-${100 + j}`,
          inspector: `검사원 ${Math.floor(Math.random() * 5) + 1}`,
          checkDate: checkDate,
          results: results,
          status: status,
          notes: `${standard.name}에 대한 품질 검사 결과입니다.`,
          images: []
        }
      });
    }
  }

  // 재고 데이터 생성
  console.log('재고 데이터 생성 중...');
  
  // 기존 재고 데이터 삭제
  await prisma.inventory.deleteMany();
  
  // 새 재고 데이터 생성
  const inventories = [
    // PCB 보드 관련 재고
    {
      itemName: '전자 회로 기판 원재료',
      quantity: 6000,
      location: 'F2-D',
      minQuantity: 3000,
      maxQuantity: 8000
    },
    {
      itemName: '구리 와이어',
      quantity: 3500,
      location: 'F2-D',
      minQuantity: 1500,
      maxQuantity: 5000
    },
    {
      itemName: 'PCB 기판 소자',
      quantity: 12000,
      location: 'F2-D',
      minQuantity: 8000,
      maxQuantity: 15000
    },
    
    // 센서 모듈 관련 재고
    {
      itemName: '온도 센서 칩',
      quantity: 7500,
      location: 'F1-D',
      minQuantity: 4000,
      maxQuantity: 9000
    },
    {
      itemName: '습도 센서 칩',
      quantity: 6800,
      location: 'F1-D',
      minQuantity: 4000,
      maxQuantity: 8000
    },
    {
      itemName: '센서 모듈 케이스',
      quantity: 4500,
      location: 'F1-D',
      minQuantity: 2000,
      maxQuantity: 6000
    },
    
    // 배터리 팩 관련 재고
    {
      itemName: '리튬이온 배터리 셀',
      quantity: 2500,
      location: 'F1-D',
      minQuantity: 3000,
      maxQuantity: 10000
    },
    {
      itemName: '배터리 보호회로',
      quantity: 3200,
      location: 'F2-D',
      minQuantity: 2000,
      maxQuantity: 4000
    },
    {
      itemName: '배터리 커넥터',
      quantity: 8000,
      location: 'F2-D',
      minQuantity: 5000,
      maxQuantity: 10000
    },
    
    // 디스플레이 패널 관련 재고
    {
      itemName: 'LCD 디스플레이 패널',
      quantity: 1200,
      location: 'F1-D',
      minQuantity: 1500,
      maxQuantity: 3000
    },
    {
      itemName: '터치스크린 필름',
      quantity: 1800,
      location: 'F2-D',
      minQuantity: 1000,
      maxQuantity: 2500
    },
    {
      itemName: '디스플레이 컨트롤러',
      quantity: 2200,
      location: 'F2-D',
      minQuantity: 1500,
      maxQuantity: 3000
    },
    
    // 케이스 어셈블리 관련 재고
    {
      itemName: '알루미늄 합금',
      quantity: 5000,
      location: 'F2-D',
      minQuantity: 1000,
      maxQuantity: 8000
    },
    {
      itemName: '고무 패킹',
      quantity: 12000,
      location: 'F1-D',
      minQuantity: 5000,
      maxQuantity: 15000
    },
    {
      itemName: '하드웨어 나사',
      quantity: 25000,
      location: 'F1-D',
      minQuantity: 10000,
      maxQuantity: 30000
    }
  ];

  await prisma.inventory.createMany({
    data: inventories
  });

  console.log('시드 데이터가 성공적으로 생성되었습니다!');
}

main()
  .catch(e => {
    console.error('시드 데이터 생성 중 오류 발생:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 