/*
  Warnings:

  - You are about to alter the column `createdAt` on the `products` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updatedAt` on the `products` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `deletedAt` on the `products` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the column `accessToken` on the `users` table. All the data in the column will be lost.
  - You are about to alter the column `createdAt` on the `users` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updatedAt` on the `users` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `deletedAt` on the `users` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - Added the required column `familyName` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `givenName` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locale` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sub` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `products` MODIFY `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updatedAt` DATETIME NULL,
    MODIFY `deletedAt` DATETIME NULL;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `accessToken`,
    ADD COLUMN `emailVerified` VARCHAR(255) NULL,
    ADD COLUMN `familyName` VARCHAR(255) NOT NULL,
    ADD COLUMN `givenName` VARCHAR(255) NOT NULL,
    ADD COLUMN `locale` VARCHAR(255) NOT NULL,
    ADD COLUMN `sub` VARCHAR(255) NOT NULL,
    MODIFY `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updatedAt` DATETIME NULL,
    MODIFY `deletedAt` DATETIME NULL;
