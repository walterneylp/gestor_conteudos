import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { listAuditLogs } from "@/lib/store";
import { formatDateTime } from "@/lib/utils";

export default async function AuditPage() {
  const logs = await listAuditLogs();

  return (
    <div className="page-grid">
      <div>
        <p className="eyebrow text-[var(--ink-soft)]">Compliance</p>
        <h1 className="section-title mt-2">Auditoria</h1>
      </div>

      <div className="grid gap-4">
        {logs.map((log) => (
          <Card key={log.id} className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold">{log.event}</p>
                <p className="mt-1 text-sm text-[var(--ink-soft)]">Ator: {log.actor}</p>
              </div>
              <div className="flex items-center gap-2">
                {log.jobId ? <Badge color="accent">{log.jobId}</Badge> : null}
                <span className="text-sm text-[var(--ink-soft)]">{formatDateTime(log.createdAt)}</span>
              </div>
            </div>
            <p className="text-sm leading-7 text-[var(--ink-soft)]">{log.details}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
