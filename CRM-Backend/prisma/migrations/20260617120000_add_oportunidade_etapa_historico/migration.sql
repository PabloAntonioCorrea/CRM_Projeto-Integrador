CREATE TABLE `oportunidade_etapa_historico` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `oportunidade_id` INTEGER UNSIGNED NOT NULL,
    `etapa_funil_id` INTEGER UNSIGNED NOT NULL,
    `entrada_em` DATETIME(3) NOT NULL,
    `saida_em` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `oportunidade_etapa_historico_oportunidade_id_idx`(`oportunidade_id`),
    INDEX `oportunidade_etapa_historico_etapa_funil_id_idx`(`etapa_funil_id`),
    INDEX `oportunidade_etapa_historico_entrada_em_idx`(`entrada_em`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `oportunidade_etapa_historico` ADD CONSTRAINT `oportunidade_etapa_historico_oportunidade_id_fkey` FOREIGN KEY (`oportunidade_id`) REFERENCES `oportunidade`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `oportunidade_etapa_historico` ADD CONSTRAINT `oportunidade_etapa_historico_etapa_funil_id_fkey` FOREIGN KEY (`etapa_funil_id`) REFERENCES `etapa_funil`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

INSERT INTO `oportunidade_etapa_historico` (`oportunidade_id`, `etapa_funil_id`, `entrada_em`, `saida_em`)
SELECT `id`, `etapa_funil_id`, `data_criacao`, NULL
FROM `oportunidade`;
