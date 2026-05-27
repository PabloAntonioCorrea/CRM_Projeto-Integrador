-- CreateTable
CREATE TABLE `proposta` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(160) NOT NULL,
    `valor` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `status` ENUM('Rascunho', 'Enviada', 'EmNegociacao', 'Aceita', 'Recusada') NOT NULL DEFAULT 'Rascunho',
    `data_proposta` DATE NOT NULL,
    `oportunidade_id` INTEGER UNSIGNED NOT NULL,
    `usuario_id` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `proposta_oportunidade_id_idx`(`oportunidade_id`),
    INDEX `proposta_usuario_id_idx`(`usuario_id`),
    INDEX `proposta_data_proposta_idx`(`data_proposta`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `proposta` ADD CONSTRAINT `proposta_oportunidade_id_fkey` FOREIGN KEY (`oportunidade_id`) REFERENCES `oportunidade`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `proposta` ADD CONSTRAINT `proposta_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
