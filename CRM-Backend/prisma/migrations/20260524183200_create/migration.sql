-- CreateTable
CREATE TABLE `usuario` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(120) NOT NULL,
    `email` VARCHAR(180) NOT NULL,
    `cargo` VARCHAR(80) NOT NULL,
    `senha` VARCHAR(255) NOT NULL,
    `perfil_acesso` ENUM('Administrador', 'Usuario') NOT NULL DEFAULT 'Usuario',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `usuario_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `etapa_funil` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(80) NOT NULL,
    `ordem` TINYINT UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `etapa_funil_nome_key`(`nome`),
    UNIQUE INDEX `etapa_funil_ordem_key`(`ordem`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lead` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(120) NOT NULL,
    `email` VARCHAR(180) NULL,
    `telefone` VARCHAR(30) NULL,
    `empresa` VARCHAR(120) NULL,
    `cidade` VARCHAR(80) NULL,
    `nicho` VARCHAR(80) NULL,
    `observacoes` TEXT NULL,
    `status` ENUM('Ativo', 'Inativo') NOT NULL DEFAULT 'Ativo',
    `data_cadastro` DATE NOT NULL,
    `usuario_id` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `lead_usuario_id_idx`(`usuario_id`),
    INDEX `lead_data_cadastro_idx`(`data_cadastro`),
    INDEX `lead_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `oportunidade` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(160) NOT NULL,
    `valor_estimado` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `prioridade` ENUM('Baixa', 'Media', 'Alta') NOT NULL DEFAULT 'Media',
    `motivo_perda` VARCHAR(255) NULL,
    `data_criacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `usuario_id` INTEGER UNSIGNED NOT NULL,
    `lead_id` INTEGER UNSIGNED NOT NULL,
    `etapa_funil_id` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `oportunidade_usuario_id_idx`(`usuario_id`),
    INDEX `oportunidade_lead_id_idx`(`lead_id`),
    INDEX `oportunidade_etapa_funil_id_idx`(`etapa_funil_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `lead` ADD CONSTRAINT `lead_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `oportunidade` ADD CONSTRAINT `oportunidade_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `oportunidade` ADD CONSTRAINT `oportunidade_lead_id_fkey` FOREIGN KEY (`lead_id`) REFERENCES `lead`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `oportunidade` ADD CONSTRAINT `oportunidade_etapa_funil_id_fkey` FOREIGN KEY (`etapa_funil_id`) REFERENCES `etapa_funil`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
