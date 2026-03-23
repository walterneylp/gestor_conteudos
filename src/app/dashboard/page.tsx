import Link from "next/link";
import { ArrowRight, DatabaseZap } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getDashboardSummary, listAuditLogs, listJobs } from "@/lib/store";
import { formatRelativeDate } from "@/lib/utils";

export default async function DashboardPage() {
  const [summary, jobs, auditLogs] = await Promise.all([
    getDashboardSummary(),
    listJobs(),
    listAuditLogs(),
  ]);

  return (
    <div className="page-grid">
      <section className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <Card className="space-y-4 bg-[var(--panel)] text-white">
          <p className="eyebrow text-white/65">MVP forte</p>
          <h1 className="max-w-3xl text-3xl font-semibold leading-tight">
            Uma base operacional para pesquisa, artigo-mestre, adaptacao social, criativos e aprovacao com n8n.
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-white/76">
            Esta primeira entrega cobre o fluxo editorial central do PRD, com storage local para agilizar o desenvolvimento e camada pronta para migrar a persistencia para Supabase assim que a conexao for informada.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/jobs/new">
              <Button>Criar novo job</Button>
            </Link>
            <Link href="/settings">
              <Button variant="secondary">Revisar integracoes</Button>
            </Link>
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow text-[var(--ink-soft)]">Infra do app</p>
              <h2 className="mt-2 text-xl font-semibold">Estado da operacao</h2>
            </div>
            <DatabaseZap className="h-5 w-5 text-[var(--accent)]" />
          </div>
          <div className="grid gap-3">
            <div className="rounded-2xl bg-[var(--surface-strong)] p-4">
              <p className="text-sm font-semibold">Persistencia</p>
              <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">
                Modo arquivo local ativo. O schema Postgres/Drizzle para Supabase ja esta preparado.
              </p>
            </div>
            <div className="rounded-2xl bg-[var(--surface-strong)] p-4">
              <p className="text-sm font-semibold">Aprovacao</p>
              <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">
                Webhooks de ida e volta para n8n publicados no app, com assinatura HMAC opcional.
              </p>
            </div>
          </div>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Jobs totais" value={summary.totalJobs} hint="Carga editorial registrada no workspace." />
        <StatCard label="Aguardando aprovacao" value={summary.awaitingApproval} hint="Itens dentro do SLA ou aguardando decisao." />
        <StatCard label="Aprovados" value={summary.approved} hint="Pacotes prontos para dashboard final ou publicacao futura." />
        <StatCard label="Falhas" value={summary.failed} hint="Jobs com problema de integracao, processamento ou governanca." />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow text-[var(--ink-soft)]">Fila editorial</p>
              <h2 className="mt-2 text-xl font-semibold">Jobs recentes</h2>
            </div>
            <Link href="/jobs" className="text-sm font-semibold text-[var(--accent)]">
              Ver tudo
            </Link>
          </div>

          <div className="space-y-3">
            {jobs.slice(0, 5).map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="flex flex-col gap-3 rounded-2xl border border-[var(--line)] bg-white p-4 transition hover:border-[var(--accent)]"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold">{job.title}</p>
                    <p className="mt-1 text-sm text-[var(--ink-soft)]">{job.objective}</p>
                  </div>
                  <Badge color={job.status === "approved" ? "success" : "accent"}>{job.status}</Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--ink-soft)]">
                  <span>{job.origin}</span>
                  <span>•</span>
                  <span>{job.selectedChannels.join(", ")}</span>
                  <span>•</span>
                  <span>{formatRelativeDate(job.updatedAt)}</span>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        <Card className="space-y-4">
          <div>
            <p className="eyebrow text-[var(--ink-soft)]">Auditoria viva</p>
            <h2 className="mt-2 text-xl font-semibold">Eventos recentes</h2>
          </div>
          <div className="space-y-3">
            {auditLogs.slice(0, 6).map((log) => (
              <div key={log.id} className="rounded-2xl border border-[var(--line)] bg-white p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold">{log.event}</p>
                  <span className="text-xs text-[var(--ink-soft)]">{formatRelativeDate(log.createdAt)}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">{log.details}</p>
              </div>
            ))}
          </div>
          <Link href="/audit" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)]">
            Abrir trilha completa <ArrowRight className="h-4 w-4" />
          </Link>
        </Card>
      </section>
    </div>
  );
}
