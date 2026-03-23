import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { listApprovalQueue } from "@/lib/store";
import { formatDateTime } from "@/lib/utils";

export default async function ApprovalsPage() {
  const queue = await listApprovalQueue();

  return (
    <div className="page-grid">
      <div>
        <p className="eyebrow text-[var(--ink-soft)]">Governanca</p>
        <h1 className="section-title mt-2">Fila de aprovacao</h1>
      </div>

      <div className="grid gap-4">
        {queue.map(({ flow, job, approvers }) => (
          <Card key={flow.id} className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">{job?.title}</h2>
                <p className="mt-2 text-sm text-[var(--ink-soft)]">{job?.objective}</p>
              </div>
              <Badge color={flow.status === "approved" ? "success" : "warning"}>{flow.status}</Badge>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm font-semibold">Expira em</p>
                <p className="mt-2 text-sm text-[var(--ink-soft)]">{formatDateTime(flow.expiresAt)}</p>
              </div>
              <div>
                <p className="text-sm font-semibold">Aprovadores</p>
                <p className="mt-2 text-sm text-[var(--ink-soft)]">
                  {approvers.map((approver) => approver.name).join(", ")}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold">Politica pos-expiracao</p>
                <p className="mt-2 text-sm text-[var(--ink-soft)]">{flow.policyAfterExpiry}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
