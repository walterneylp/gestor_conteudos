import { Cable, Palette, ShieldEllipsis, Waypoints } from "lucide-react";
import { AiRoutingManager } from "@/components/settings/ai-routing-manager";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getSettingsSnapshot } from "@/lib/store";

export default async function SettingsPage() {
  const snapshot = await getSettingsSnapshot();
  const enabledProviders = snapshot.providers.filter((provider) => provider.enabled).length;
  const enabledEndpoints = snapshot.endpoints.filter((endpoint) => endpoint.enabled).length;

  return (
    <div className="page-grid">
      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-[32px] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--surface)_74%,transparent),var(--surface-strong))]">
          <p className="eyebrow text-[var(--ink-soft)]">Setup</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Configuração com leitura por domínio</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--ink-soft)]">
            Em vez de uma página estática de blocos, a área de configurações agora é tratada como mapa de ativação do sistema: identidade, aprovação, providers e integrações operacionais.
          </p>
        </Card>

        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
          <Card className="rounded-[28px]">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[var(--surface-strong)] p-2.5">
                <Cable className="h-4 w-4 text-[var(--accent)]" />
              </div>
              <div>
                <p className="text-sm font-semibold">Providers ativos</p>
                <p className="text-sm text-[var(--ink-soft)]">{enabledProviders}</p>
              </div>
            </div>
          </Card>
          <Card className="rounded-[28px]">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[var(--surface-strong)] p-2.5">
                <Waypoints className="h-4 w-4 text-[var(--accent)]" />
              </div>
              <div>
                <p className="text-sm font-semibold">Endpoints ativos</p>
                <p className="text-sm text-[var(--ink-soft)]">{enabledEndpoints}</p>
              </div>
            </div>
          </Card>
          <Card className="rounded-[28px]">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[var(--surface-strong)] p-2.5">
                <ShieldEllipsis className="h-4 w-4 text-[var(--accent)]" />
              </div>
              <div>
                <p className="text-sm font-semibold">Modo de dados</p>
                <p className="text-sm text-[var(--ink-soft)]">
                  {snapshot.supabasePublicConfigured
                    ? "Supabase API publica"
                    : snapshot.databaseConfigured
                      ? "Supabase/Postgres"
                      : "Local fallback"}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="space-y-5 rounded-[30px]">
          <div>
            <p className="eyebrow text-[var(--ink-soft)]">Workspace</p>
            <h2 className="mt-2 text-xl font-semibold">{snapshot.settings.workspaceName}</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[24px] bg-[var(--surface-strong)] p-4">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-[var(--accent)]" />
                <p className="text-sm font-semibold">Tom institucional</p>
              </div>
              <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">{snapshot.settings.branding.tone}</p>
            </div>
            <div className="rounded-[24px] bg-[var(--surface-strong)] p-4">
              <p className="text-sm font-semibold">CTA padrão</p>
              <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">
                {snapshot.settings.branding.defaultCta}
              </p>
            </div>
            <div className="rounded-[24px] bg-[var(--surface-contrast)] p-4">
              <p className="text-sm font-semibold">SLA</p>
              <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">
                {snapshot.settings.approval.slaHours} horas
              </p>
            </div>
            <div className="rounded-[24px] bg-[var(--surface-contrast)] p-4">
              <p className="text-sm font-semibold">Conexao publica</p>
              <p className="mt-3 break-all text-sm leading-7 text-[var(--ink-soft)]">
                {snapshot.supabasePublicConfigured
                  ? snapshot.supabaseUrl
                  : "NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY ainda nao configurados"}
              </p>
            </div>
            <div className="rounded-[24px] bg-[var(--surface-contrast)] p-4">
              <p className="text-sm font-semibold">Destino do banco</p>
              <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">
                {snapshot.databaseConfigured
                  ? "Supabase/Postgres configurado"
                  : "Persistencia real ainda aguardando DATABASE_URL do Postgres do Supabase"}
              </p>
            </div>
          </div>
        </Card>

        <Card className="space-y-4 rounded-[30px]">
          <div>
            <p className="eyebrow text-[var(--ink-soft)]">Aprovadores padrão</p>
            <h2 className="mt-2 text-xl font-semibold">Fluxo base</h2>
          </div>
          <div className="space-y-3">
            {snapshot.approvers.map((approver) => (
              <div key={approver.id} className="rounded-[24px] border border-[var(--line)] bg-[var(--surface-contrast)] p-4">
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
        <Card className="space-y-4 rounded-[30px]">
          <div>
            <p className="eyebrow text-[var(--ink-soft)]">Providers</p>
            <h2 className="mt-2 text-xl font-semibold">Roteamento por domínio</h2>
          </div>
          <div className="grid gap-3">
            {snapshot.providers.map((provider) => (
              <div key={provider.id} className="rounded-[24px] border border-[var(--line)] bg-[var(--surface-contrast)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{provider.name}</p>
                    <p className="mt-1 text-sm text-[var(--ink-soft)]">{provider.notes}</p>
                  </div>
                  <Badge color={provider.enabled ? "success" : "danger"}>{provider.strategy}</Badge>
                </div>
                <p className="mt-3 text-xs uppercase tracking-[0.16em] text-[var(--ink-soft)]">{provider.domain}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-4 rounded-[30px]">
          <div>
            <p className="eyebrow text-[var(--ink-soft)]">n8n e webhooks</p>
            <h2 className="mt-2 text-xl font-semibold">Endpoints configurados</h2>
          </div>
          <div className="grid gap-3">
            {snapshot.endpoints.map((endpoint) => (
              <div key={endpoint.id} className="rounded-[24px] border border-[var(--line)] bg-[var(--surface-contrast)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{endpoint.name}</p>
                    <p className="mt-1 break-all text-sm text-[var(--ink-soft)]">{endpoint.url}</p>
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

      <AiRoutingManager
        searchProviders={snapshot.searchProviders}
        llmProviders={snapshot.llmProviders}
        initialPrimary={snapshot.settings.searchRouting.primary}
        initialFallback={snapshot.settings.searchRouting.fallback}
      />
    </div>
  );
}
