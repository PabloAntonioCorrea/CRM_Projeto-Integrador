/*
  Warnings:

  - You are about to drop the column `motivo_perda` on the `oportunidade` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `oportunidade` DROP COLUMN `motivo_perda`,
    ADD COLUMN `motivo_perda_id` INTEGER UNSIGNED NULL;

-- CreateTable
CREATE TABLE `motivo_perda` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(120) NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `motivo_perda_nome_key`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `oportunidade_motivo_perda_id_idx` ON `oportunidade`(`motivo_perda_id`);

-- AddForeignKey
ALTER TABLE `oportunidade` ADD CONSTRAINT `oportunidade_motivo_perda_id_fkey` FOREIGN KEY (`motivo_perda_id`) REFERENCES `motivo_perda`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
