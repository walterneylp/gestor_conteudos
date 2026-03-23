"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";
import { primaryNavigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export const AppShell = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1600px] gap-6 px-4 py-4 lg:px-6">
      <aside className="hidden w-[280px] shrink-0 rounded-[30px] bg-[var(--panel)] p-6 text-white shadow-[0_20px_70px_-28px_rgba(16,42,67,0.85)] lg:flex lg:flex-col">
        <div className="space-y-3">
          <span className="eyebrow text-white/65">Gestor v2</span>
          <div>
            <h1 className="text-2xl font-semibold">Bastidor editorial</h1>
            <p className="mt-2 text-sm leading-6 text-white/74">
              Pesquisa, artigo-mestre, variantes sociais, criativos, aprovacao e integracoes em um fluxo unico.
            </p>
          </div>
        </div>

        <nav className="mt-8 flex flex-1 flex-col gap-2">
          {primaryNavigation.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                  active ? "bg-white text-[var(--panel)]" : "text-white/72 hover:bg-white/10 hover:text-white",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="rounded-[24px] border border-white/14 bg-white/6 p-4 text-sm text-white/75">
          <p className="font-semibold text-white">Modo local ativo</p>
          <p className="mt-2 leading-6">
            O app funciona com persistencia local para acelerar o desenvolvimento. Ao configurar `DATABASE_URL`, o alvo vira Supabase/Postgres.
          </p>
        </div>
      </aside>

      <div className="flex min-h-[calc(100vh-2rem)] flex-1 flex-col gap-4">
        <header className="rounded-[28px] border border-[var(--line)] bg-[rgba(255,253,248,0.88)] px-5 py-4 backdrop-blur">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="eyebrow text-[var(--ink-soft)]">Plataforma editorial multicanal</p>
              <h2 className="text-xl font-semibold">Operacao, aprovacao e distribuicao com governanca</h2>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--ink-soft)]">
              <span className="rounded-full bg-[var(--surface)] px-3 py-1.5">Next.js local</span>
              <span className="rounded-full bg-[var(--surface)] px-3 py-1.5">Supabase ready</span>
              <span className="rounded-full bg-[var(--surface)] px-3 py-1.5">n8n webhook ready</span>
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};
