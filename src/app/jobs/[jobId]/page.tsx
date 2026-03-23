import { ArrowRight, FileText, ImageIcon, Layers3, ShieldCheck, Sparkles, Waypoints } from "lucide-react";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { socialLabels } from "@/lib/navigation";
import { getJobDetail } from "@/lib/store";
import { formatDateTime } from "@/lib/utils";

const statusColorMap = {
  draft: "neutral",
  processing: "accent",
  awaiting_approval: "warning",
  approved: "success",
  rejected: "danger",
  expired: "danger",
  published: "success",
  failed: "danger",
} as const;

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  const detail = await getJobDetail(jobId);

  if (!detail) {
    notFound();
  }

  return (
    <div className="page-grid">
      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="rounded-[34px] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--surface)_72%,transparent),var(--surface-strong))]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl">
              <p className="eyebrow text-[var(--ink-soft)]">Job detail</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">{detail.job.title}</h1>
              <p className="mt-4 text-sm leading-7 text-[var(--ink-soft)]">
                {detail.job.sourceSummary}
              </p>
            </div>
            <Badge color={statusColorMap[detail.job.status] || "accent"}>{detail.job.status}</Badge>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[24px] bg-[var(--surface)] p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--ink-soft)]">Origem</p>
              <p className="mt-3 font-semibold">{detail.job.origin}</p>
            </div>
            <div className="rounded-[24px] bg-[var(--surface)] p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--ink-soft)]">Prazo</p>
              <p className="mt-3 font-semibold">{formatDateTime(detail.job.dueAt)}</p>
            </div>
            <div className="rounded-[24px] bg-[var(--surface)] p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--ink-soft)]">Atualizado</p>
              <p className="mt-3 font-semibold">{formatDateTime(detail.job.updatedAt)}</p>
            </div>
            <div className="rounded-[24px] bg-[var(--surface)] p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--ink-soft)]">Canais</p>
              <p className="mt-3 font-semibold">
                {detail.job.selectedChannels.map((channel) => socialLabels[channel]).join(", ")}
              </p>
            </div>
          </div>
        </Card>

        <Card className="rounded-[34px] bg-[linear-gradient(160deg,var(--panel)_0%,color-mix(in_srgb,var(--panel-soft)_86%,black)_100%)] text-white">
          <p className="eyebrow text-white/60">Trilha crítica</p>
          <h2 className="mt-2 text-2xl font-semibold">Pacote operacional</h2>
          <div className="mt-5 grid gap-3">
            <div className="rounded-[24px] border border-white/10 bg-white/6 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white/10 p-2.5">
                  <FileText className="h-4 w-4" />
                </div>
                <p className="font-semibold">Artigo-mestre pronto</p>
              </div>
              <p className="mt-3 text-sm leading-6 text-white/72">
                Estrutura central criada para orientar copy, aprovação e distribuição.
              </p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/6 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white/10 p-2.5">
                  <Layers3 className="h-4 w-4" />
                </div>
                <p className="font-semibold">{detail.variants.length} variantes sociais</p>
              </div>
              <p className="mt-3 text-sm leading-6 text-white/72">
                Cada canal já nasce com headline, corpo, CTA e base de hashtags.
              </p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/6 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white/10 p-2.5">
                  <ImageIcon className="h-4 w-4" />
                </div>
                <p className="font-semibold">{detail.creativeAssets.length} criativos base</p>
              </div>
              <p className="mt-3 text-sm leading-6 text-white/72">
                Descrições e formatos prontos para virar peça visual ou briefing.
              </p>
            </div>
          </div>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.88fr_1.12fr]">
        <Card className="space-y-4 rounded-[32px]">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[var(--surface-strong)] p-2.5">
              <ShieldCheck className="h-4 w-4 text-[var(--accent)]" />
            </div>
            <div>
              <p className="eyebrow text-[var(--ink-soft)]">Aprovação</p>
              <h2 className="mt-1 text-xl font-semibold">Fluxo configurado</h2>
            </div>
          </div>

          <div className="grid gap-3">
            {detail.approvers.map((approver) => (
              <div
                key={approver.id}
                className="rounded-[24px] border border-[var(--line)] bg-[var(--surface-contrast)] p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{approver.name}</p>
                    <p className="mt-1 text-sm text-[var(--ink-soft)]">{approver.email}</p>
                  </div>
                  <Badge color="neutral">ordem {approver.order}</Badge>
                </div>
              </div>
            ))}
          </div>

          {detail.approvalFlow ? (
            <div className="rounded-[24px] bg-[var(--surface-strong)] p-4 text-sm leading-7 text-[var(--ink-soft)]">
              Status atual <strong>{detail.approvalFlow.status}</strong>, expira em{" "}
              <strong>{formatDateTime(detail.approvalFlow.expiresAt)}</strong> e segue política{" "}
              <strong>{detail.approvalFlow.policyAfterExpiry}</strong>.
            </div>
          ) : null}

          <div className="rounded-[24px] border border-dashed border-[var(--line)] p-4">
            <p className="text-sm font-semibold">Últimas decisões</p>
            <div className="mt-3 grid gap-3">
              {detail.approvalActions.length > 0 ? (
                detail.approvalActions.map((action) => (
                  <div key={action.id} className="rounded-[20px] bg-[var(--surface-contrast)] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold">{action.approverEmail}</p>
                      <Badge color="accent">{action.decision}</Badge>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">{action.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm leading-6 text-[var(--ink-soft)]">
                  Nenhuma decisão registrada ainda para este job.
                </p>
              )}
            </div>
          </div>
        </Card>

        <Card className="space-y-5 rounded-[32px]">
          <div>
            <p className="eyebrow text-[var(--ink-soft)]">Artigo-mestre</p>
            <h2 className="mt-2 text-2xl font-semibold">{detail.masterArticle?.title}</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">
              {detail.masterArticle?.subtitle}
            </p>
          </div>

          <div className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
            <div className="rounded-[24px] bg-[var(--surface-strong)] p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--ink-soft)]">Resumo</p>
              <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">
                {detail.masterArticle?.summary}
              </p>
            </div>

            <div className="rounded-[24px] border border-[var(--line)] bg-[var(--surface)] p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--ink-soft)]">
                CTA editorial
              </p>
              <p className="mt-3 text-sm leading-7">
                {detail.masterArticle?.cta}
              </p>
              <p className="mt-4 text-xs uppercase tracking-[0.16em] text-[var(--ink-soft)]">
                Notas
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">
                {detail.masterArticle?.editorialNotes}
              </p>
            </div>
          </div>

          <div className="rounded-[28px] border border-[var(--line)] bg-[var(--surface-contrast)] p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[var(--surface)] p-2.5">
                <Sparkles className="h-4 w-4 text-[var(--accent)]" />
              </div>
              <p className="font-semibold">Corpo central</p>
            </div>
            <pre className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[var(--ink-soft)]">
              {detail.masterArticle?.body}
            </pre>
          </div>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card className="space-y-4 rounded-[32px]">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[var(--surface-strong)] p-2.5">
              <Waypoints className="h-4 w-4 text-[var(--accent)]" />
            </div>
            <div>
              <p className="eyebrow text-[var(--ink-soft)]">Grounding</p>
              <h2 className="mt-1 text-xl font-semibold">Fonte e referências</h2>
            </div>
          </div>

          <div className="rounded-[24px] bg-[var(--surface-strong)] p-5">
            <p className="font-semibold">{detail.source?.title}</p>
            <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">
              {detail.source?.normalizedText}
            </p>
          </div>

          <div className="grid gap-3">
            {(detail.source?.references || []).map((reference) => (
              <div
                key={reference.url}
                className="rounded-[24px] border border-[var(--line)] bg-[var(--surface-contrast)] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{reference.label}</p>
                    <p className="mt-2 break-all text-sm text-[var(--ink-soft)]">{reference.url}</p>
                  </div>
                  <Badge color="neutral">{reference.trustScore}%</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-4 rounded-[32px]">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[var(--surface-strong)] p-2.5">
              <Layers3 className="h-4 w-4 text-[var(--accent)]" />
            </div>
            <div>
              <p className="eyebrow text-[var(--ink-soft)]">Distribuição</p>
              <h2 className="mt-1 text-xl font-semibold">Variantes e criativos</h2>
            </div>
          </div>

          <div className="grid gap-3">
            {detail.variants.map((variant) => (
              <div
                key={variant.id}
                className="rounded-[24px] border border-[var(--line)] bg-[var(--surface-contrast)] p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{socialLabels[variant.channel]}</p>
                  <Badge color="accent">{variant.status}</Badge>
                </div>
                <p className="mt-3 text-sm font-semibold">{variant.headline}</p>
                <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">{variant.body}</p>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[var(--ink-soft)]">
                  <span>{variant.hashtags.join(" ")}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                  <span>{variant.cta}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-3">
            {detail.creativeAssets.map((asset) => (
              <div
                key={asset.id}
                className="rounded-[24px] border border-[var(--line)] bg-[var(--surface)] p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">
                    {socialLabels[asset.channel]} • {asset.type}
                  </p>
                  <Badge color="neutral">{asset.dimensions}</Badge>
                </div>
                <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">{asset.description}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
