# Gestor de Conteudos

Plataforma editorial multicanal baseada no `prd.md`, com:

- intake por pesquisa ou artigo pronto
- artigo-mestre
- variantes para LinkedIn, Instagram, X e Facebook
- criativos base por canal
- dashboard operacional
- fila de aprovacao
- endpoints de webhook para n8n
- trilha de auditoria
- camada preparada para Supabase/Postgres

## Stack

- Next.js 16 + App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Drizzle ORM
- Postgres/Supabase

## Rodar localmente

```bash
pnpm install
pnpm dev
```

Abra `http://localhost:3000`.

Sem `DATABASE_URL`, o app usa persistencia local em `.data/store.json` para nao bloquear o desenvolvimento. Quando a string de conexao do Supabase for configurada, o schema Drizzle ja esta pronto para a migracao.

## Variaveis de ambiente

Copie `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Campos relevantes:

- `DATABASE_URL`: conexao Postgres do Supabase
- `N8N_OUTBOUND_SECRET`: segredo para assinar payloads enviados ao n8n
- `N8N_INBOUND_SECRET`: segredo para validar callbacks de aprovacao
- `EXTERNAL_WEBHOOK_SECRET`: segredo para webhooks externos

## Banco e schema

Gerar arquivos do Drizzle:

```bash
pnpm db:generate
```

Aplicar schema ao Postgres configurado:

```bash
pnpm db:push
```

## Endpoints principais

- `POST /api/webhooks/n8n/outbound`
- `POST /api/webhooks/n8n/inbound`
- `POST /api/webhooks/external`

## Container

Build futuro:

```bash
docker build -t gestor-conteudos .
docker run -p 3000:3000 --env-file .env.local gestor-conteudos
```
