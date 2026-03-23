import Link from "next/link";
import { ArrowRight, CircleDashed, Compass, DatabaseZap, Orbit, Radar, Sparkles } from "lucide-react";
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
      <section className="grid gap-4 xl:grid-cols-[1.45fr_0.95fr]">
        <Card className="overflow-hidden rounded-[34px] border-none bg-[linear-gradient(135deg,var(--panel)_0%,var(--panel-soft)_70%,color-mix(in_srgb,var(--accent)_32%,var(--panel))_100%)] p-0 text-white shadow-[0_28px_90px_-36px_var(--shadow-color)]">
          <div className="grid gap-8 p-7 xl:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="eyebrow text-white/58">Newsroom operacional</p>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight">
                O painel agora precisa ajudar a decidir, não só listar status.
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/75">
                Reestruturei a home para funcionar como centro de comando editorial: visão executiva no topo,
                radar de prontidão, fila crítica e trilha de eventos com leitura rápida.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/jobs/new">
                  <Button>Criar novo job</Button>
                </Link>
                <Link href="/jobs">
                  <Button variant="secondary">Abrir pipeline</Button>
                </Link>
              </div>
            </div>
            <div className="grid gap-3 self-start">
              <div className="rounded-[26px] border border-white/10 bg-black/18 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">Prontidão de stack</p>
                    <p className="mt-1 text-sm text-white/60">Infra que sustenta o fluxo editorial</p>
                  </div>
                  <Radar className="h-5 w-5 text-white/70" />
                </div>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/68">UI operacional</span>
                    <Badge color="success">ativo</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/68">Storage local</span>
                    <Badge color="accent">provisório</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/68">Supabase</span>
                    <Badge color="warning">aguardando</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/68">n8n</span>
                    <Badge color="warning">aguardando</Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-[24px] border border-white/10 bg-white/8 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-white/50">Modo</p>
                  <p className="mt-3 font-mono text-lg text-white">Local-first</p>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-white/8 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-white/50">Entrega</p>
                  <p className="mt-3 font-mono text-lg text-white">Webhook-ready</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="space-y-5 rounded-[34px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow text-[var(--ink-soft)]">Mapa rápido</p>
              <h2 className="mt-2 text-xl font-semibold">Estado da operação</h2>
            </div>
            <Compass className="h-5 w-5 text-[var(--accent)]" />
          </div>
          <div className="grid gap-3">
            {[
              {
                title: "Persistência",
                text: "Modo arquivo local ativo. Schema Drizzle pronto para Supabase/Postgres.",
                icon: DatabaseZap,
              },
              {
                title: "Aprovação",
                text: "Entrada e retorno do n8n já publicados com suporte a assinatura HMAC.",
                icon: Orbit,
              },
              {
                title: "Próximo desbloqueio",
                text: "Conectar banco real, credenciais de webhook e providers de geração.",
                icon: Sparkles,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-[24px] border border-[var(--line)] bg-[var(--surface-contrast)] p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-[var(--surface-strong)] p-2.5">
                      <Icon className="h-4 w-4 text-[var(--accent)]" />
                    </div>
                    <p className="font-semibold">{item.title}</p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[var(--ink-soft)]">{item.text}</p>
                </div>
              );
            })}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Jobs totais" value={summary.totalJobs} hint="Carga editorial registrada no workspace." />
        <StatCard label="Aguardando aprovacao" value={summary.awaitingApproval} hint="Itens dentro do SLA ou aguardando decisao." />
        <StatCard label="Aprovados" value={summary.approved} hint="Pacotes prontos para dashboard final ou publicacao futura." />
        <StatCard label="Falhas" value={summary.failed} hint="Jobs com problema de integracao, processamento ou governanca." />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="space-y-5 rounded-[32px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow text-[var(--ink-soft)]">Linha crítica</p>
              <h2 className="mt-2 text-xl font-semibold">Jobs que definem o ritmo</h2>
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
                className="grid gap-3 rounded-[26px] border border-[var(--line)] bg-[var(--surface-contrast)] p-4 transition hover:border-[var(--accent)] xl:grid-cols-[1fr_auto]"
              >
                <div className="flex flex-col gap-3">
                  <div>
                    <p className="font-semibold">{job.title}</p>
                    <p className="mt-1 text-sm leading-6 text-[var(--ink-soft)]">{job.objective}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--ink-soft)]">
                    <span>{job.origin}</span>
                    <span>•</span>
                    <span>{job.selectedChannels.join(", ")}</span>
                    <span>•</span>
                    <span>{formatRelativeDate(job.updatedAt)}</span>
                  </div>
                </div>
                <div className="flex items-start justify-between gap-3 xl:flex-col xl:items-end">
                  <Badge color={job.status === "approved" ? "success" : "accent"}>{job.status}</Badge>
                  <div className="rounded-full bg-[var(--surface-strong)] px-3 py-1.5 text-xs font-medium text-[var(--ink-soft)]">
                    dono: {job.ownerName}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        <div className="grid gap-4">
          <Card className="space-y-4 rounded-[32px]">
            <div className="flex items-center justify-between">
              <div>
                <p className="eyebrow text-[var(--ink-soft)]">Radar de execução</p>
                <h2 className="mt-2 text-xl font-semibold">Leitura instantânea</h2>
              </div>
              <CircleDashed className="h-5 w-5 text-[var(--accent)]" />
            </div>
            <div className="grid gap-3">
              {summary.jobsByStatus.map((item) => (
                <div key={item.label} className="rounded-[24px] bg-[var(--surface-strong)] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold">{item.label}</p>
                    <span className="font-mono text-lg">{item.value}</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-[color-mix(in_srgb,var(--line)_70%,transparent)]">
                    <div
                      className="h-2 rounded-full bg-[var(--accent)]"
                      style={{ width: `${summary.totalJobs ? (item.value / summary.totalJobs) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="space-y-4 rounded-[32px]">
            <div>
              <p className="eyebrow text-[var(--ink-soft)]">Auditoria viva</p>
              <h2 className="mt-2 text-xl font-semibold">Eventos recentes</h2>
            </div>
            <div className="space-y-3">
              {auditLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="rounded-[24px] border border-[var(--line)] bg-[var(--surface-contrast)] p-4">
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
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="rounded-[32px]">
          <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="eyebrow text-[var(--ink-soft)]">Bloco executivo</p>
              <h2 className="mt-2 text-xl font-semibold">O que esta pronto agora</h2>
            </div>
            <div className="grid gap-3">
              {[
                "Tema claro/escuro persistido no navegador",
                "Dashboard reestruturado em leitura executiva + operacional",
                "Rodapé lateral com versão e timestamp do build",
                "Base pronta para conectar Supabase sem refazer UI",
              ].map((item) => (
                <div key={item} className="rounded-[24px] border border-[var(--line)] bg-[var(--surface-contrast)] px-4 py-3 text-sm leading-6 text-[var(--ink-soft)]">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="rounded-[32px] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--surface)_88%,transparent),var(--surface-strong))]">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="eyebrow text-[var(--ink-soft)]">Próxima camada</p>
              <h2 className="mt-2 text-xl font-semibold">Quando você mandar as credenciais</h2>
            </div>
            <Link href="/settings">
              <Button variant="ghost">Ir para integrações</Button>
            </Link>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {[
              "Virar persistência para Supabase real",
              "Enviar payloads reais para n8n",
              "Substituir mock de geração por providers configuráveis",
            ].map((item) => (
              <div key={item} className="rounded-[24px] border border-[var(--line)] bg-[var(--surface)] p-4 text-sm leading-6 text-[var(--ink-soft)]">
                {item}
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
