-- CreateTable
CREATE TABLE `ProductionEquipment` (
    `id` VARCHAR(191) NOT NULL,
    `productionId` VARCHAR(191) NOT NULL,
    `equipmentId` VARCHAR(191) NOT NULL,
    `sequence` INTEGER NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ProductionEquipment_productionId_idx`(`productionId`),
    INDEX `ProductionEquipment_equipmentId_idx`(`equipmentId`),
    UNIQUE INDEX `ProductionEquipment_productionId_equipmentId_key`(`productionId`, `equipmentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProductionEquipment` ADD CONSTRAINT `ProductionEquipment_productionId_fkey` FOREIGN KEY (`productionId`) REFERENCES `Production`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductionEquipment` ADD CONSTRAINT `ProductionEquipment_equipmentId_fkey` FOREIGN KEY (`equipmentId`) REFERENCES `Equipment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
