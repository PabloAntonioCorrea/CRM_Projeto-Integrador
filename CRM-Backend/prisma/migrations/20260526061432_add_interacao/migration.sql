-- CreateTable
CREATE TABLE `interacao` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `tipo` ENUM('Ligacao', 'Email', 'Reuniao', 'Nota', 'Registro') NOT NULL,
    `descricao` TEXT NOT NULL,
    `data_interacao` DATETIME(3) NOT NULL,
    `lead_id` INTEGER UNSIGNED NOT NULL,
    `oportunidade_id` INTEGER UNSIGNED NULL,
    `usuario_id` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `interacao_lead_id_idx`(`lead_id`),
    INDEX `interacao_oportunidade_id_idx`(`oportunidade_id`),
    INDEX `interacao_usuario_id_idx`(`usuario_id`),
    INDEX `interacao_data_interacao_idx`(`data_interacao`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `interacao` ADD CONSTRAINT `interacao_lead_id_fkey` FOREIGN KEY (`lead_id`) REFERENCES `lead`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `interacao` ADD CONSTRAINT `interacao_oportunidade_id_fkey` FOREIGN KEY (`oportunidade_id`) REFERENCES `oportunidade`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `interacao` ADD CONSTRAINT `interacao_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
