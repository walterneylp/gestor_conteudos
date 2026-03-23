"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";
import { Activity, Database, GitBranch, PanelLeft, ShieldCheck, Zap } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { primaryNavigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export const AppShell = ({
  children,
  appVersion,
  buildLabel,
}: PropsWithChildren<{ appVersion: string; buildLabel: string }>) => {
  const pathname = usePathname();

  return (
    <div className="dashboard-shell mx-auto flex min-h-screen w-full max-w-[1700px] gap-4 px-3 py-3 lg:px-5 lg:py-5">
      <aside className="hidden w-[310px] shrink-0 rounded-[32px] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,var(--panel)_0%,var(--panel-soft)_100%)] p-5 text-white shadow-[0_28px_90px_-36px_var(--shadow-color)] lg:flex lg:flex-col">
        <div className="space-y-4 border-b border-white/10 pb-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="eyebrow text-white/55">Editorial control room</span>
              <h1 className="mt-3 text-[1.75rem] font-semibold leading-none">Gestor</h1>
            </div>
            <div className="rounded-2xl bg-white/8 p-3 text-white/80">
              <PanelLeft className="h-5 w-5" />
            </div>
          </div>
          <p className="text-sm leading-6 text-white/72">
            Fluxo único para pesquisa, produção, adaptação social, aprovação e integração operacional.
          </p>
        </div>

        <div className="mt-5 grid gap-3 rounded-[26px] border border-white/10 bg-white/6 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[rgba(255,255,255,0.08)] p-2.5">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">MVP operacional</p>
              <p className="text-xs text-white/60">Modo local com trilha pronta para nuvem</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-white/68">
            <div className="rounded-2xl bg-black/12 p-3">
              <p className="font-semibold text-white">Core</p>
              <p className="mt-1">Jobs, variantes e auditoria</p>
            </div>
            <div className="rounded-2xl bg-black/12 p-3">
              <p className="font-semibold text-white">Entrega</p>
              <p className="mt-1">n8n webhook ready</p>
            </div>
          </div>
        </div>

        <nav className="mt-6 flex flex-1 flex-col gap-2">
          {primaryNavigation.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-[20px] border px-4 py-3 text-sm font-medium transition",
                  active
                    ? "border-[var(--accent)] bg-[var(--accent)] text-white shadow-[0_12px_34px_-20px_rgba(0,0,0,0.5)]"
                    : "border-transparent text-white/72 hover:bg-white/10 hover:text-white",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="grid gap-3 rounded-[26px] border border-white/10 bg-black/14 p-4 text-sm text-white/78">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-white/70" />
            <span>Storage local ativo</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-white/70" />
            <span>Assinatura HMAC pronta</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-white/70" />
            <span>Supabase e n8n aguardando credenciais</span>
          </div>
        </div>

        <div className="mt-4 rounded-[24px] border border-white/10 bg-white/6 p-4 text-white/72">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/48">
            <GitBranch className="h-3.5 w-3.5" />
            versionamento
          </div>
          <p className="mt-3 font-mono text-sm text-white">v{appVersion}</p>
          <p className="mt-1 text-sm">Build: {buildLabel}</p>
        </div>
      </aside>

      <div className="flex min-h-[calc(100vh-1.5rem)] flex-1 flex-col gap-4">
        <header className="rounded-[30px] border border-[var(--line)] bg-[color-mix(in_srgb,var(--surface)_82%,transparent)] px-5 py-4 shadow-[0_18px_48px_-30px_var(--shadow-color)] backdrop-blur">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="eyebrow text-[var(--ink-soft)]">Plataforma editorial multicanal</p>
              <h2 className="mt-2 text-[1.45rem] font-semibold tracking-tight">
                Operação, aprovação e distribuição com governança
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <ThemeToggle />
              <span className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--ink-soft)]">
                Next.js local
              </span>
              <span className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--ink-soft)]">
                Supabase ready
              </span>
              <span className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--ink-soft)]">
                n8n webhook ready
              </span>
            </div>
          </div>

          <div className="-mx-2 mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {primaryNavigation.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "shrink-0 rounded-full border px-3 py-2 text-sm font-medium transition",
                    active
                      ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                      : "border-[var(--line)] bg-[var(--surface)] text-[var(--ink-soft)]",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};
