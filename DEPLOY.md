# CRM Compact.Jr — Guia de Deploy

Documento de implantação do **CRM Compact.Jr** (Projeto Integrador). Repositório: [github.com/PabloAntonioCorrea/CRM_Projeto-Integrador](https://github.com/PabloAntonioCorrea/CRM_Projeto-Integrador.git).

## Visão geral

| Componente | Tecnologia | Porta padrão |
|------------|------------|--------------|
| Frontend | React + Vite + Nginx | 8080 |
| API | Node.js + Express + Prisma | 3333 |
| Banco | MySQL 8 | 3306 |

## Pré-requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows/macOS) ou Docker Engine + Docker Compose (Linux)
- Git (para clonar o repositório)

## Deploy com Docker Compose (recomendado)

### 1. Clonar o repositório

```powershell
git clone https://github.com/PabloAntonioCorrea/CRM_Projeto-Integrador.git
cd CRM_Projeto-Integrador
```

### 2. Configurar variáveis de ambiente

Copie o arquivo de exemplo na raiz do projeto:

```powershell
Copy-Item .env.example .env
```

Variáveis disponíveis:

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `MYSQL_ROOT_PASSWORD` | Senha root do MySQL | `root` |
| `VITE_API_URL` | URL da API usada no build do frontend | `http://localhost:3333` |

> **Importante:** `VITE_API_URL` é embutida no build do frontend. Se alterar a URL da API, reconstrua o container: `docker compose up -d --build frontend`.

### 3. Subir os serviços

```powershell
docker compose up -d --build
```

Na primeira execução, a API:

1. Aguarda o MySQL ficar saudável
2. Aplica as migrations (`prisma migrate deploy`)
3. Popula dados iniciais se o banco estiver vazio (`prisma/ensureSeed.js`)
4. Inicia a API na porta 3333

### 4. Acessar a aplicação

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:8080 |
| API | http://localhost:3333 |
| Health check | http://localhost:3333/health |

**Login padrão (primeiro deploy):**

- E-mail: `admin@empresa.com`
- Senha: `123456`

### 5. Comandos úteis

```powershell
docker compose ps
docker compose logs -f api
docker compose logs -f frontend
docker compose down
docker compose down -v
```

- `docker compose down -v` remove também o volume do MySQL (apaga todos os dados).

## Deploy manual (sem Docker)

### Backend

```powershell
cd CRM-Backend
Copy-Item .env.example .env
npm ci
npx prisma migrate deploy
npm run db:seed
npm start
```

Configure `DATABASE_URL` no `.env` apontando para seu MySQL local.

### Frontend

```powershell
cd CRM-Frontend
npm ci
$env:VITE_API_URL="http://localhost:3333"
npm run build
npm run preview
```

Para desenvolvimento local com hot reload:

```powershell
npm run dev
```

## Estrutura Docker

```
Projeto Integrador/
├── docker-compose.yml
├── .env.example
├── CRM-Backend/
│   ├── Dockerfile
│   ├── docker-entrypoint.sh
│   └── prisma/ensureSeed.js
└── CRM-Frontend/
    ├── Dockerfile
    └── nginx.conf
```

### Serviços no Compose

- **db** — MySQL 8 com volume persistente `crm_mysql_data`
- **api** — Backend Node; depende do healthcheck do MySQL
- **frontend** — Build estático servido pelo Nginx

## Seed e banco de dados

| Comando | Quando usar |
|---------|-------------|
| `ensureSeed.js` (automático no Docker) | Primeira subida com banco vazio — cria admin, etapas e motivos |
| `npm run db:seed` (manual) | Desenvolvimento — **apaga todos os dados** e recria o mínimo |
| `npm run db:seed:demo` (manual) | **Vídeo/apresentação** — apaga tudo e cria ~22 oportunidades com histórico de etapas para os tempos médios do funil |
| `npm run db:reset` (manual) | Reset completo: migrations + seed destrutivo |

No Docker, reiniciar os containers **não** apaga dados existentes.

### Popular banco para demonstrar o funil (tempos médios)

**Com Docker rodando:**

```powershell
docker compose exec api npm run db:seed:demo
```

**Sem Docker (backend local):**

```powershell
cd CRM-Backend
npm run db:seed:demo
```

Isso cria 20 leads, 22 oportunidades distribuídas no funil e histórico de etapas com datas retroativas (3 a 18 dias por etapa). Depois, abra o **Funil de Vendas** — cada coluna deve exibir o tempo médio em dias.

Login continua: `admin@empresa.com` / `123456` (vendedores `ana@empresa.com` e `bruno@empresa.com`, mesma senha).

## Produção (considerações)

Para ambiente real, ajuste:

1. **Senhas** — altere `MYSQL_ROOT_PASSWORD` e credenciais do admin após o primeiro login
2. **VITE_API_URL** — use a URL pública da API (ex.: `https://api.seudominio.com`)
3. **HTTPS** — coloque um reverse proxy (Nginx, Traefik, Caddy) na frente do frontend e da API
4. **Backup** — configure backup periódico do volume `crm_mysql_data`

## Lacunas conhecidas (escopo acadêmico)

Funcionalidades **fora do escopo** desta entrega:

- Autenticação JWT completa (login usa sessão local + header `X-Usuario-Id`)
- Multi-tenant / múltiplas empresas
- Notificações por e-mail

Funcionalidades **corrigidas nesta versão**:

- Editar e excluir interações na UI
- Editar título/prazo de tarefas na UI
- Modal de motivo ao marcar oportunidade como Perdida pelo formulário de edição

## Solução de problemas

| Problema | Solução |
|----------|---------|
| Frontend não conecta na API | Verifique `VITE_API_URL` e reconstrua o frontend |
| API não sobe | `docker compose logs api` — geralmente MySQL ainda não pronto ou `DATABASE_URL` incorreta |
| Banco vazio após deploy | Confira logs da API por "Seed inicial concluído" |
| Porta em uso | Altere as portas em `docker-compose.yml` (ex.: `"8081:80"`) |

## Checklist Entrega 4

- [x] Sistema funcional
- [x] Repositório GitHub
- [ ] Vídeo demonstrativo (responsabilidade da equipe)
- [x] Dockerfile + docker-compose
- [x] Documento de deploy (este arquivo)
