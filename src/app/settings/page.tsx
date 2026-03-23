import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getSettingsSnapshot } from "@/lib/store";

export default async function SettingsPage() {
  const snapshot = await getSettingsSnapshot();

  return (
    <div className="page-grid">
      <div>
        <p className="eyebrow text-[var(--ink-soft)]">Setup</p>
        <h1 className="section-title mt-2">Configuracoes e integracoes</h1>
      </div>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="space-y-4">
          <div>
            <p className="eyebrow text-[var(--ink-soft)]">Workspace</p>
            <h2 className="mt-2 text-xl font-semibold">{snapshot.settings.workspaceName}</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-[var(--surface-strong)] p-4">
              <p className="text-sm font-semibold">Tom institucional</p>
              <p className="mt-2 text-sm leading-7 text-[var(--ink-soft)]">{snapshot.settings.branding.tone}</p>
            </div>
            <div className="rounded-2xl bg-[var(--surface-strong)] p-4">
              <p className="text-sm font-semibold">CTA padrao</p>
              <p className="mt-2 text-sm leading-7 text-[var(--ink-soft)]">
                {snapshot.settings.branding.defaultCta}
              </p>
            </div>
            <div className="rounded-2xl bg-[var(--surface-strong)] p-4">
              <p className="text-sm font-semibold">SLA</p>
              <p className="mt-2 text-sm leading-7 text-[var(--ink-soft)]">
                {snapshot.settings.approval.slaHours} horas
              </p>
            </div>
            <div className="rounded-2xl bg-[var(--surface-strong)] p-4">
              <p className="text-sm font-semibold">Destino do banco</p>
              <p className="mt-2 text-sm leading-7 text-[var(--ink-soft)]">
                {snapshot.databaseConfigured ? "Supabase/Postgres configurado" : "Modo local aguardando DATABASE_URL"}
              </p>
            </div>
          </div>
        </Card>

        <Card className="space-y-4">
          <div>
            <p className="eyebrow text-[var(--ink-soft)]">Aprovadores padrao</p>
            <h2 className="mt-2 text-xl font-semibold">Fluxo base</h2>
          </div>
          <div className="space-y-3">
            {snapshot.approvers.map((approver) => (
              <div key={approver.id} className="rounded-2xl border border-[var(--line)] bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{approver.name}</p>
                    <p className="mt-1 text-sm text-[var(--ink-soft)]">{approver.email}</p>
                  </div>
                  <Badge color="neutral">{approver.level}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card className="space-y-4">
          <div>
            <p className="eyebrow text-[var(--ink-soft)]">Providers</p>
            <h2 className="mt-2 text-xl font-semibold">Roteamento por dominio</h2>
          </div>
          <div className="space-y-3">
            {snapshot.providers.map((provider) => (
              <div key={provider.id} className="rounded-2xl border border-[var(--line)] bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{provider.name}</p>
                    <p className="mt-1 text-sm text-[var(--ink-soft)]">{provider.notes}</p>
                  </div>
                  <Badge color={provider.enabled ? "success" : "danger"}>{provider.strategy}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-4">
          <div>
            <p className="eyebrow text-[var(--ink-soft)]">n8n e webhooks</p>
            <h2 className="mt-2 text-xl font-semibold">Endpoints configurados</h2>
          </div>
          <div className="space-y-3">
            {snapshot.endpoints.map((endpoint) => (
              <div key={endpoint.id} className="rounded-2xl border border-[var(--line)] bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{endpoint.name}</p>
                    <p className="mt-1 text-sm text-[var(--ink-soft)]">{endpoint.url}</p>
                  </div>
                  <Badge color={endpoint.secretConfigured ? "success" : "warning"}>
                    {endpoint.secretConfigured ? "secret ok" : "sem secret"}
                  </Badge>
                </div>
                <p className="mt-3 text-sm text-[var(--ink-soft)]">
                  Timeout {endpoint.timeoutMs}ms • Retries {endpoint.retries}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
