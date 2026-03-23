import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { socialLabels } from "@/lib/navigation";
import { getJobDetail } from "@/lib/store";
import { formatDateTime } from "@/lib/utils";

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
      <section className="grid gap-4 xl:grid-cols-[1.25fr_0.85fr]">
        <Card className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="eyebrow text-[var(--ink-soft)]">Job</p>
              <h1 className="mt-2 text-3xl font-semibold">{detail.job.title}</h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--ink-soft)]">
                {detail.job.sourceSummary}
              </p>
            </div>
            <Badge color={detail.job.status === "approved" ? "success" : "accent"}>{detail.job.status}</Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <p className="text-sm font-semibold">Origem</p>
              <p className="mt-2 text-sm text-[var(--ink-soft)]">{detail.job.origin}</p>
            </div>
            <div>
              <p className="text-sm font-semibold">Atualizado</p>
              <p className="mt-2 text-sm text-[var(--ink-soft)]">{formatDateTime(detail.job.updatedAt)}</p>
            </div>
            <div>
              <p className="text-sm font-semibold">Prazo</p>
              <p className="mt-2 text-sm text-[var(--ink-soft)]">{formatDateTime(detail.job.dueAt)}</p>
            </div>
            <div>
              <p className="text-sm font-semibold">Canais</p>
              <p className="mt-2 text-sm text-[var(--ink-soft)]">
                {detail.job.selectedChannels.map((channel) => socialLabels[channel]).join(", ")}
              </p>
            </div>
          </div>
        </Card>

        <Card className="space-y-4">
          <div>
            <p className="eyebrow text-[var(--ink-soft)]">Aprovacao</p>
            <h2 className="mt-2 text-xl font-semibold">Fluxo configurado</h2>
          </div>
          <div className="space-y-3">
            {detail.approvers.map((approver) => (
              <div key={approver.id} className="rounded-2xl border border-[var(--line)] bg-white p-4">
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
            <p className="text-sm leading-6 text-[var(--ink-soft)]">
              Status atual: <strong>{detail.approvalFlow.status}</strong>. Expira em{" "}
              {formatDateTime(detail.approvalFlow.expiresAt)} com politica{" "}
              <strong>{detail.approvalFlow.policyAfterExpiry}</strong>.
            </p>
          ) : null}
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <Card className="space-y-4">
          <div>
            <p className="eyebrow text-[var(--ink-soft)]">Artigo-mestre</p>
            <h2 className="mt-2 text-xl font-semibold">{detail.masterArticle?.title}</h2>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold">Resumo</p>
              <p className="mt-2 text-sm leading-7 text-[var(--ink-soft)]">{detail.masterArticle?.summary}</p>
            </div>
            <div>
              <p className="text-sm font-semibold">Corpo</p>
              <pre className="mt-2 whitespace-pre-wrap rounded-2xl bg-[var(--surface-strong)] p-4 text-sm leading-7 text-[var(--ink)]">
                {detail.masterArticle?.body}
              </pre>
            </div>
            <div>
              <p className="text-sm font-semibold">CTA</p>
              <p className="mt-2 text-sm leading-7 text-[var(--ink-soft)]">{detail.masterArticle?.cta}</p>
            </div>
          </div>
        </Card>

        <Card className="space-y-4">
          <div>
            <p className="eyebrow text-[var(--ink-soft)]">Fonte e grounding</p>
            <h2 className="mt-2 text-xl font-semibold">Registro de origem</h2>
          </div>
          <div className="rounded-2xl bg-[var(--surface-strong)] p-4">
            <p className="text-sm font-semibold">{detail.source?.title}</p>
            <p className="mt-2 text-sm leading-7 text-[var(--ink-soft)]">{detail.source?.normalizedText}</p>
          </div>
          <div className="space-y-2">
            {(detail.source?.references || []).map((reference) => (
              <div key={reference.url} className="rounded-2xl border border-[var(--line)] bg-white p-4 text-sm">
                <p className="font-semibold">{reference.label}</p>
                <p className="mt-1 text-[var(--ink-soft)]">{reference.url}</p>
                <p className="mt-2 text-[var(--ink-soft)]">Confiabilidade estimada: {reference.trustScore}%</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card className="space-y-4">
          <div>
            <p className="eyebrow text-[var(--ink-soft)]">Variantes sociais</p>
            <h2 className="mt-2 text-xl font-semibold">Adaptacoes por canal</h2>
          </div>
          <div className="space-y-3">
            {detail.variants.map((variant) => (
              <div key={variant.id} className="rounded-2xl border border-[var(--line)] bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{socialLabels[variant.channel]}</p>
                  <Badge color="accent">{variant.status}</Badge>
                </div>
                <p className="mt-3 text-sm font-semibold">{variant.headline}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--ink-soft)]">{variant.body}</p>
                <p className="mt-3 text-sm text-[var(--ink-soft)]">
                  CTA: <strong>{variant.cta}</strong>
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-4">
          <div>
            <p className="eyebrow text-[var(--ink-soft)]">Creative studio</p>
            <h2 className="mt-2 text-xl font-semibold">Criativos gerados</h2>
          </div>
          <div className="space-y-3">
            {detail.creativeAssets.map((asset) => (
              <div key={asset.id} className="rounded-2xl border border-[var(--line)] bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">
                    {socialLabels[asset.channel]} • {asset.type}
                  </p>
                  <Badge color="neutral">{asset.dimensions}</Badge>
                </div>
                <p className="mt-2 text-sm leading-7 text-[var(--ink-soft)]">{asset.description}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
