# Gestor de Conteudos MVP Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Construir um MVP funcional da plataforma editorial multicanal com jobs de conteudo, artigo-mestre, variantes sociais, aprovacao via n8n webhooks, dashboard, configuracoes e persistencia em Supabase Postgres.

**Architecture:** O MVP sera um monolito web em Next.js com App Router, rotas server-side e camada de dominio separada da UI. A persistencia usara Postgres remoto do Supabase por meio de Drizzle ORM, enquanto integracoes de IA, imagem e n8n ficarao atras de adapters para permitir mock local agora e credenciais reais depois.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, Drizzle ORM, Postgres/Supabase, Zod, React Hook Form, date-fns, Lucide Icons.

---

### Task 1: Bootstrap do projeto

**Files:**
- Create: `package.json`
- Create: `src/app/**/*`
- Create: `src/components/**/*`
- Create: `src/lib/**/*`
- Create: `drizzle.config.ts`
- Create: `.env.example`

**Step 1: Gerar o scaffold do app**

Run: `pnpm create next-app@latest . --ts --tailwind --eslint --app --src-dir --use-pnpm --import-alias "@/*" --no-turbopack`
Expected: projeto Next.js criado sem sobrescrever o `prd.md`.

**Step 2: Instalar dependencias de dominio**

Run: `pnpm add drizzle-orm postgres zod react-hook-form @hookform/resolvers date-fns lucide-react clsx tailwind-merge class-variance-authority`
Expected: dependencias instaladas.

**Step 3: Instalar dependencias de desenvolvimento**

Run: `pnpm add -D drizzle-kit`
Expected: toolchain de migrations pronta.

### Task 2: Base arquitetural e design system

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/page.tsx`
- Create: `src/components/layout/**/*`
- Create: `src/components/ui/**/*`
- Create: `src/lib/utils.ts`

**Step 1: Criar shell do dashboard**

Implementar sidebar, header, area de conteudo e navegacao primaria para Jobs, Dashboard, Aprovacoes, Integracoes e Configuracoes.

**Step 2: Criar componentes reutilizaveis**

Adicionar cards, badges, tabelas simples, empty states e blocos de status com foco no dominio editorial.

### Task 3: Modelo de dados MVP

**Files:**
- Create: `src/db/schema.ts`
- Create: `src/db/client.ts`
- Create: `src/db/seed.ts`
- Create: `drizzle/*.sql`

**Step 1: Modelar entidades centrais**

Criar tabelas para `workspaces`, `users`, `content_jobs`, `source_records`, `master_articles`, `social_variants`, `creative_assets`, `approval_flows`, `approvers`, `approval_actions`, `integration_endpoints`, `api_providers`, `audit_logs`.

**Step 2: Criar enums e constraints**

Representar origem do job, status, rede social, tipo de ativo e politicas de expiracao.

**Step 3: Criar seed inicial**

Popular um workspace demo, usuarios demo, providers mock, endpoints n8n mock e jobs de exemplo para o dashboard nascer util.

### Task 4: Camada de dominio e repositorios

**Files:**
- Create: `src/domain/jobs/**/*`
- Create: `src/domain/articles/**/*`
- Create: `src/domain/approvals/**/*`
- Create: `src/domain/integrations/**/*`

**Step 1: Criar tipos e mapeadores de dominio**

Separar DTOs da camada de persistencia.

**Step 2: Criar servicos de aplicacao**

Implementar criacao de job, atualizacao de artigo-mestre, geracao de variantes sociais mock, criacao de fluxo de aprovacao e registro de auditoria.

### Task 5: Fluxo principal de jobs

**Files:**
- Create: `src/app/jobs/page.tsx`
- Create: `src/app/jobs/new/**/*`
- Create: `src/app/jobs/[jobId]/page.tsx`
- Create: `src/app/actions/jobs.ts`

**Step 1: Implementar wizard de entrada**

Suportar os dois caminhos iniciais: pesquisar assunto e enviar artigo pronto.

**Step 2: Implementar formulario com validacao**

Campos principais do PRD: tema, objetivo, publico, idioma, profundidade, tom, tamanho, artigo bruto, URL, estrategia de uso do artigo.

**Step 3: Persistir job e dados derivados**

Criar job, source record, artigo-mestre inicial e variantes sociais mockadas.

**Step 4: Implementar tela de detalhe**

Exibir resumo do job, artigo-mestre editavel, variantes por rede, criativos e trilha de aprovacao.

### Task 6: Dashboard operacional

**Files:**
- Create: `src/app/dashboard/page.tsx`
- Create: `src/app/approvals/page.tsx`
- Create: `src/app/audit/page.tsx`

**Step 1: Implementar metricas e visoes**

Cards de status, fila de aprovacoes, jobs recentes, falhas de integracao e eventos de auditoria.

**Step 2: Implementar filtros**

Status, origem, rede, prioridade e busca textual.

### Task 7: Settings e integracoes

**Files:**
- Create: `src/app/settings/page.tsx`
- Create: `src/app/settings/**/*`
- Create: `src/app/api/webhooks/n8n/outbound/route.ts`
- Create: `src/app/api/webhooks/n8n/inbound/route.ts`
- Create: `src/app/api/webhooks/external/route.ts`

**Step 1: Implementar telas de configuracao**

Branding, aprovadores, endpoints n8n, providers de API e politicas basicas.

**Step 2: Implementar contratos de webhook**

Criar endpoints com assinatura HMAC, idempotencia basica e logging.

### Task 8: Preparacao para Supabase e deploy containerizado

**Files:**
- Create: `.env.example`
- Create: `README.md`
- Create: `Dockerfile`
- Create: `.dockerignore`

**Step 1: Definir variaveis de ambiente**

Documentar conexao Postgres/Supabase, segredos de webhook e chaves futuras de providers.

**Step 2: Preparar container**

Criar Dockerfile para execucao futura em container.

### Task 9: Validacao e versionamento

**Files:**
- Modify: `package.json`
- Modify: `.gitignore`

**Step 1: Validar**

Run: `pnpm lint`
Expected: sem erros.

Run: `pnpm build`
Expected: build de producao concluido.

**Step 2: Inicializar git**

Run: `git init && git branch -M main`
Expected: repositorio local inicializado.

**Step 3: Conectar remoto**

Run: `git remote add origin https://github.com/walterneylp/gestor_conteudos.git`
Expected: remoto configurado.

**Step 4: Preparar primeiro snapshot**

Run: `git add . && git commit -m "feat: scaffold gestor de conteudos mvp"`
Expected: baseline do projeto registrada.
