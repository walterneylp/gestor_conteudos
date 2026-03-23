import { Clock3, ShieldCheck, TimerReset } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { listApprovalQueue } from "@/lib/store";
import { formatDateTime } from "@/lib/utils";

export default async function ApprovalsPage() {
  const queue = await listApprovalQueue();
  const pendingCount = queue.filter((item) => item.flow.status === "pending").length;
  const approvedCount = queue.filter((item) => item.flow.status === "approved").length;

  return (
    <div className="page-grid">
      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="rounded-[32px] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--surface)_74%,transparent),var(--surface-strong))]">
          <p className="eyebrow text-[var(--ink-soft)]">Governança</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Aprovação com SLA legível e ação clara</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--ink-soft)]">
            Esta tela agora funciona como torre de controle do fluxo decisório. O operador enxerga volume pendente, ritmo de aprovação e impacto do SLA antes de abrir cada item.
          </p>
        </Card>

        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
          <Card className="rounded-[28px]">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[var(--surface-strong)] p-2.5">
                <Clock3 className="h-4 w-4 text-[var(--accent)]" />
              </div>
              <div>
                <p className="text-sm font-semibold">Pendentes</p>
                <p className="text-sm text-[var(--ink-soft)]">{pendingCount} fluxos</p>
              </div>
            </div>
          </Card>
          <Card className="rounded-[28px]">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[var(--surface-strong)] p-2.5">
                <ShieldCheck className="h-4 w-4 text-[var(--accent)]" />
              </div>
              <div>
                <p className="text-sm font-semibold">Aprovados</p>
                <p className="text-sm text-[var(--ink-soft)]">{approvedCount} fluxos</p>
              </div>
            </div>
          </Card>
          <Card className="rounded-[28px]">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[var(--surface-strong)] p-2.5">
                <TimerReset className="h-4 w-4 text-[var(--accent)]" />
              </div>
              <div>
                <p className="text-sm font-semibold">Política padrão</p>
                <p className="text-sm text-[var(--ink-soft)]">dashboard_review</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <div className="grid gap-4">
        {queue.map(({ flow, job, approvers }) => (
          <Card key={flow.id} className="space-y-4 rounded-[30px]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">{job?.title}</h2>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--ink-soft)]">{job?.objective}</p>
              </div>
              <Badge color={flow.status === "approved" ? "success" : "warning"}>{flow.status}</Badge>
            </div>
            <div className="grid gap-4 xl:grid-cols-[0.8fr_1fr_0.8fr]">
              <div className="rounded-[24px] bg-[var(--surface-strong)] p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--ink-soft)]">Expiração</p>
                <p className="mt-3 text-sm font-semibold">{formatDateTime(flow.expiresAt)}</p>
              </div>
              <div className="rounded-[24px] bg-[var(--surface-contrast)] p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--ink-soft)]">Aprovadores</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {approvers.map((approver) => (
                    <span
                      key={approver.id}
                      className="rounded-full border border-[var(--line)] px-3 py-1.5 text-sm text-[var(--ink-soft)]"
                    >
                      {approver.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-[24px] bg-[var(--surface-contrast)] p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--ink-soft)]">Pós-expiração</p>
                <p className="mt-3 text-sm font-semibold text-[var(--ink)]">{flow.policyAfterExpiry}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
