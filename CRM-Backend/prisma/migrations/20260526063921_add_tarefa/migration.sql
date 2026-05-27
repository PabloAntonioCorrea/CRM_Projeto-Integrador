-- CreateTable
CREATE TABLE `tarefa` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(160) NOT NULL,
    `descricao` TEXT NULL,
    `data_prazo` DATE NOT NULL,
    `status` ENUM('Pendente', 'Concluida') NOT NULL DEFAULT 'Pendente',
    `lead_id` INTEGER UNSIGNED NOT NULL,
    `oportunidade_id` INTEGER UNSIGNED NULL,
    `usuario_id` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `tarefa_lead_id_idx`(`lead_id`),
    INDEX `tarefa_oportunidade_id_idx`(`oportunidade_id`),
    INDEX `tarefa_usuario_id_idx`(`usuario_id`),
    INDEX `tarefa_data_prazo_idx`(`data_prazo`),
    INDEX `tarefa_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tarefa` ADD CONSTRAINT `tarefa_lead_id_fkey` FOREIGN KEY (`lead_id`) REFERENCES `lead`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tarefa` ADD CONSTRAINT `tarefa_oportunidade_id_fkey` FOREIGN KEY (`oportunidade_id`) REFERENCES `oportunidade`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tarefa` ADD CONSTRAINT `tarefa_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
