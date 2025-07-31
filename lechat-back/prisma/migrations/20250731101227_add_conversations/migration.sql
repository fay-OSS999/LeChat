/*
  Warnings:

  - You are about to drop the column `clientId` on the `conversation` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `conversation` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `conversation` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `conversation` table. All the data in the column will be lost.
  - You are about to drop the column `conversationId` on the `message` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[message_id]` on the table `Conversation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `message_id` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `conversation_id` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `Message_conversationId_fkey`;

-- DropIndex
DROP INDEX `Message_conversationId_fkey` ON `message`;

-- AlterTable
ALTER TABLE `conversation` DROP COLUMN `clientId`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `status`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `agent_id` INTEGER NULL,
    ADD COLUMN `assigned_at` DATETIME(3) NULL,
    ADD COLUMN `client_name` VARCHAR(191) NULL,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `expired` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `message_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `responded` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `message` DROP COLUMN `conversationId`,
    ADD COLUMN `conversation_id` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Conversation_message_id_key` ON `Conversation`(`message_id`);

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_conversation_id_fkey` FOREIGN KEY (`conversation_id`) REFERENCES `Conversation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Conversation` ADD CONSTRAINT `Conversation_agent_id_fkey` FOREIGN KEY (`agent_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
