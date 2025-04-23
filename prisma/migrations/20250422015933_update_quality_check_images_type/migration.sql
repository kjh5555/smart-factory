/*
  Warnings:

  - You are about to drop the column `productName` on the `QualityCheck` table. All the data in the column will be lost.
  - You are about to drop the column `result` on the `QualityCheck` table. All the data in the column will be lost.
  - Added the required column `results` to the `QualityCheck` table without a default value. This is not possible if the table is not empty.
  - Added the required column `standardId` to the `QualityCheck` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `QualityCheck` DROP COLUMN `productName`,
    DROP COLUMN `result`,
    ADD COLUMN `images` JSON NOT NULL,
    ADD COLUMN `productionId` VARCHAR(191) NULL,
    ADD COLUMN `results` JSON NOT NULL,
    ADD COLUMN `standardId` VARCHAR(191) NOT NULL,
    ADD COLUMN `status` ENUM('PENDING', 'PASSED', 'FAILED', 'NEEDS_REVIEW') NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE `QualityStandard` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `criteria` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `QualityStandard_productId_idx`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `QualityCheck_standardId_idx` ON `QualityCheck`(`standardId`);

-- CreateIndex
CREATE INDEX `QualityCheck_productionId_idx` ON `QualityCheck`(`productionId`);

-- AddForeignKey
ALTER TABLE `QualityCheck` ADD CONSTRAINT `QualityCheck_standardId_fkey` FOREIGN KEY (`standardId`) REFERENCES `QualityStandard`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QualityCheck` ADD CONSTRAINT `QualityCheck_productionId_fkey` FOREIGN KEY (`productionId`) REFERENCES `Production`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QualityStandard` ADD CONSTRAINT `QualityStandard_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
