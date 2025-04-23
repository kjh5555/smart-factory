/*
  Warnings:

  - You are about to drop the column `type` on the `Equipment` table. All the data in the column will be lost.
  - The values [MANAGER] on the enum `User_role` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `typeId` to the `Equipment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Equipment` DROP COLUMN `type`,
    ADD COLUMN `typeId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE `EquipmentType` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Equipment` ADD CONSTRAINT `Equipment_typeId_fkey` FOREIGN KEY (`typeId`) REFERENCES `EquipmentType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
