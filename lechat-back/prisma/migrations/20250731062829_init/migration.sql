-- CreateTable
CREATE TABLE `Message` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `message_id` VARCHAR(191) NOT NULL,
    `agent_id` INTEGER NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `assigned_at` DATETIME(3) NOT NULL,
    `responded` BOOLEAN NOT NULL DEFAULT false,
    `expired` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Message_message_id_key`(`message_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_agent_id_fkey` FOREIGN KEY (`agent_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
