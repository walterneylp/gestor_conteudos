import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";
import packageJson from "@/../package.json";
import { AppShell } from "@/components/layout/app-shell";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gestor de Conteudos",
  description:
    "Plataforma editorial multicanal para pesquisa, artigo-mestre, criativos e aprovacoes com n8n.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const buildLabel = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(new Date());

  return (
    <html
      lang="pt-BR"
      className={`${manrope.variable} ${plexMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem("gestor-theme");
                  var preferredDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                  var theme = saved || (preferredDark ? "dark" : "light");
                  document.documentElement.dataset.theme = theme;
                } catch (error) {
                  document.documentElement.dataset.theme = "light";
                }
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full bg-[var(--canvas)] text-[var(--ink)]">
        <AppShell appVersion={packageJson.version} buildLabel={buildLabel}>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
