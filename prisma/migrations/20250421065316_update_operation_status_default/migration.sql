/*
  Warnings:

  - You are about to alter the column `operationStatus` on the `Equipment` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(4))` to `Enum(EnumId(2))`.

*/
-- AlterTable
ALTER TABLE `Equipment` MODIFY `operationStatus` ENUM('OPERATING', 'STANDBY') NOT NULL DEFAULT 'STANDBY';
