/*
  Warnings:

  - You are about to drop the column `operationStatus` on the `Equipment` table. All the data in the column will be lost.
  - The values [REPAIR] on the enum `Production_status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `floor` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `zone` on the `Location` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Location` will be added. If there are existing duplicate values, this will fail.
  - Made the column `description` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Equipment` DROP COLUMN `operationStatus`,
    MODIFY `status` ENUM('ACTIVE', 'INACTIVE', 'MAINTENANCE', 'PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'ACTIVE',
    MODIFY `lastMaintenance` DATETIME(3) NULL,
    MODIFY `nextMaintenance` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Location` DROP COLUMN `floor`,
    DROP COLUMN `zone`;

-- AlterTable
ALTER TABLE `Product` MODIFY `description` VARCHAR(191) NOT NULL,
    MODIFY `baseDays` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `ProductEquipment` ADD COLUMN `sequence` INTEGER NOT NULL DEFAULT 1,
    MODIFY `quantity` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `Production` MODIFY `status` ENUM('ACTIVE', 'INACTIVE', 'MAINTENANCE', 'PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PLANNED';

-- CreateIndex
CREATE UNIQUE INDEX `Location_name_key` ON `Location`(`name`);

-- CreateIndex
CREATE INDEX `ProductEquipment_productId_idx` ON `ProductEquipment`(`productId`);

-- RenameIndex
ALTER TABLE `Equipment` RENAME INDEX `Equipment_locationId_fkey` TO `Equipment_locationId_idx`;

-- RenameIndex
ALTER TABLE `Equipment` RENAME INDEX `Equipment_typeId_fkey` TO `Equipment_typeId_idx`;

-- RenameIndex
ALTER TABLE `ProductEquipment` RENAME INDEX `ProductEquipment_equipmentTypeId_fkey` TO `ProductEquipment_equipmentTypeId_idx`;

-- RenameIndex
ALTER TABLE `Production` RENAME INDEX `Production_productId_fkey` TO `Production_productId_idx`;
