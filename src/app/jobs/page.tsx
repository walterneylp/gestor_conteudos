import Link from "next/link";
import { ArrowRight, Layers3, ListFilter, Radar, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { listJobs } from "@/lib/store";
import { formatDateTime, formatRelativeDate } from "@/lib/utils";

export default async function JobsPage() {
  const jobs = await listJobs();
  const researchJobs = jobs.filter((job) => job.origin === "research").length;
  const articleJobs = jobs.filter((job) => job.origin === "article").length;
  const multiChannelJobs = jobs.filter((job) => job.selectedChannels.length > 2).length;

  return (
    <div className="page-grid">
      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="rounded-[32px] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--surface)_70%,transparent),var(--surface-strong))]">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="eyebrow text-[var(--ink-soft)]">Pipeline editorial</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">Jobs como fluxo, não como planilha</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--ink-soft)]">
                Reestruturei esta tela para leitura rápida do funil de trabalho: origem, intensidade multicanal, criticidade e recência ficam mais explícitas antes de entrar no detalhe.
              </p>
            </div>
            <Link
              href="/jobs/new"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
            >
              Novo job <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
          <Card className="rounded-[28px]">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[var(--surface-strong)] p-2.5">
                <Radar className="h-4 w-4 text-[var(--accent)]" />
              </div>
              <div>
                <p className="text-sm font-semibold">Pesquisa</p>
                <p className="text-sm text-[var(--ink-soft)]">{researchJobs} jobs</p>
              </div>
            </div>
          </Card>
          <Card className="rounded-[28px]">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[var(--surface-strong)] p-2.5">
                <Sparkles className="h-4 w-4 text-[var(--accent)]" />
              </div>
              <div>
                <p className="text-sm font-semibold">Artigo base</p>
                <p className="text-sm text-[var(--ink-soft)]">{articleJobs} jobs</p>
              </div>
            </div>
          </Card>
          <Card className="rounded-[28px]">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[var(--surface-strong)] p-2.5">
                <Layers3 className="h-4 w-4 text-[var(--accent)]" />
              </div>
              <div>
                <p className="text-sm font-semibold">Multi-canal forte</p>
                <p className="text-sm text-[var(--ink-soft)]">{multiChannelJobs} jobs</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Card className="rounded-[32px]">
        <div className="flex flex-col gap-4 border-b border-[var(--line)] pb-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="eyebrow text-[var(--ink-soft)]">Lista operacional</p>
            <h2 className="mt-2 text-xl font-semibold">Fila completa de jobs</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--ink-soft)]">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-2">
              <ListFilter className="h-4 w-4" />
              filtros visuais virão na próxima rodada
            </span>
          </div>
        </div>

        <div className="mt-5 grid gap-3">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              className="grid gap-4 rounded-[26px] border border-[var(--line)] bg-[var(--surface-contrast)] p-5 transition hover:border-[var(--accent)] xl:grid-cols-[1.4fr_0.6fr_0.7fr]"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge color={job.origin === "research" ? "accent" : "neutral"}>{job.origin}</Badge>
                  <span className="text-xs text-[var(--ink-soft)]">{formatRelativeDate(job.updatedAt)}</span>
                </div>
                <p className="mt-3 text-lg font-semibold">{job.title}</p>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--ink-soft)]">{job.objective}</p>
              </div>

              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--ink-soft)]">Canais</p>
                <p className="text-sm font-medium text-[var(--ink)]">{job.selectedChannels.join(", ")}</p>
                <p className="text-xs text-[var(--ink-soft)]">Atualizado em {formatDateTime(job.updatedAt)}</p>
              </div>

              <div className="flex items-start justify-between gap-3 xl:flex-col xl:items-end">
                <Badge color={job.status === "approved" ? "success" : "accent"}>{job.status}</Badge>
                <span className="rounded-full bg-[var(--surface-strong)] px-3 py-1.5 text-xs font-medium text-[var(--ink-soft)]">
                  {job.ownerName}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
