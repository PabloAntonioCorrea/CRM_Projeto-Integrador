CREATE TABLE `cargo` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(80) NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `cargo_nome_key`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `cargo` (`nome`, `ativo`, `created_at`, `updated_at`) VALUES
('Administrador', true, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
('Diretor Comercial', true, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
('Segundo em comando', true, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
('Assessor', true, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
('Vendedor', true, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
('Consultora Comercial', true, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
('Executivo de Vendas', true, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));

INSERT INTO `cargo` (`nome`, `ativo`, `created_at`, `updated_at`)
SELECT DISTINCT u.cargo, true, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)
FROM `usuario` u
WHERE u.cargo IS NOT NULL
  AND TRIM(u.cargo) <> ''
  AND NOT EXISTS (SELECT 1 FROM `cargo` c WHERE c.nome = u.cargo);
