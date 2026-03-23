"use client";

import { FileText, Layers3, Search, Sparkles, Target, Waypoints } from "lucide-react";
import { useState } from "react";
import { createJobAction } from "@/app/actions/jobs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const channels = [
  { key: "linkedin", label: "LinkedIn" },
  { key: "instagram", label: "Instagram" },
  { key: "x", label: "X" },
  { key: "facebook", label: "Facebook" },
] as const;

const workflowMoments = [
  {
    title: "Entrada estruturada",
    body: "Tema ou artigo entram com contexto editorial, destino e intenção de negócio.",
    icon: Target,
  },
  {
    title: "Pacote multicanal",
    body: "O sistema já nasce com artigo-mestre, variantes, criativos e trilha de aprovação.",
    icon: Layers3,
  },
  {
    title: "Pronto para operação",
    body: "A entrega fica preparada para automação, distribuição e auditoria posterior.",
    icon: Waypoints,
  },
];

export const JobIntakeForm = () => {
  const [origin, setOrigin] = useState<"research" | "article">("research");
  const [selectedChannels, setSelectedChannels] = useState<string[]>(
    channels.map((channel) => channel.key),
  );

  const isResearch = origin === "research";

  const toggleChannel = (channelKey: string) => {
    setSelectedChannels((current) =>
      current.includes(channelKey)
        ? current.filter((item) => item !== channelKey)
        : [...current, channelKey],
    );
  };

  return (
    <form action={createJobAction} className="grid gap-4 xl:grid-cols-[1.18fr_0.82fr]">
      <input type="hidden" name="origin" value={origin} />

      <div className="grid gap-4">
        <Card className="rounded-[32px] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--surface)_72%,transparent),var(--surface-strong))]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl">
              <p className="eyebrow text-[var(--ink-soft)]">Entrada guiada</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                Escolha o ponto de partida e monte o pacote editorial
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--ink-soft)]">
                O intake já organiza briefing, profundidade, canais e material de origem para que o
                job saia pronto para produção, aprovação e distribuição.
              </p>
            </div>

            <div className="grid gap-2 rounded-[24px] border border-[var(--line)] bg-[var(--surface)] p-3 text-sm">
              <button
                type="button"
                onClick={() => setOrigin("research")}
                className={`rounded-[18px] px-4 py-3 text-left transition ${
                  isResearch
                    ? "bg-[var(--accent)] text-white"
                    : "bg-[var(--surface-contrast)] text-[var(--ink)]"
                }`}
              >
                <span className="flex items-center gap-2 font-semibold">
                  <Search className="h-4 w-4" />
                  Pesquisa
                </span>
                <span className="mt-1 block text-xs opacity-80">
                  Quando o job nasce de um tema, hipótese ou briefing.
                </span>
              </button>

              <button
                type="button"
                onClick={() => setOrigin("article")}
                className={`rounded-[18px] px-4 py-3 text-left transition ${
                  !isResearch
                    ? "bg-[var(--accent)] text-white"
                    : "bg-[var(--surface-contrast)] text-[var(--ink)]"
                }`}
              >
                <span className="flex items-center gap-2 font-semibold">
                  <FileText className="h-4 w-4" />
                  Artigo pronto
                </span>
                <span className="mt-1 block text-xs opacity-80">
                  Quando você já tem um texto e quer estruturar reaproveitamento.
                </span>
              </button>
            </div>
          </div>
        </Card>

        <Card className="grid gap-4 rounded-[32px] md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold">Título do job</label>
            <Input
              name="title"
              placeholder={
                isResearch
                  ? "Ex.: IA para operações editoriais com governança"
                  : "Ex.: Transformar artigo de autoridade em operação multicanal"
              }
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Objetivo</label>
            <Input
              name="objective"
              placeholder="Ex.: gerar autoridade, pipeline, educação do mercado"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Público</label>
            <Input name="audience" placeholder="Ex.: CMOs, founders, editorial leads" required />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Idioma</label>
            <Input name="language" defaultValue="pt-BR" required />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Tom</label>
            <Input name="tone" defaultValue="Consultivo e direto" required />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Profundidade</label>
            <Select name="depth" defaultValue="Tatico">
              <option>Tatico</option>
              <option>Analitico</option>
              <option>Executivo</option>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Tamanho desejado</label>
            <Input name="desiredLength" defaultValue="1.000 palavras" required />
          </div>
        </Card>

        <Card className="grid gap-4 rounded-[32px]">
          <div>
            <p className="eyebrow text-[var(--ink-soft)]">
              {isResearch ? "Grounding" : "Material-base"}
            </p>
            <h3 className="mt-2 text-xl font-semibold">
              {isResearch ? "Estruture o contexto da pesquisa" : "Organize o texto de origem"}
            </h3>
            <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">
              {isResearch
                ? "Use o resumo para explicar o recorte, a tese central e o contexto que a IA deve respeitar."
                : "Use o resumo para explicar o ângulo editorial e o artigo bruto para colar o conteúdo completo."}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">
              {isResearch ? "Resumo do briefing" : "Resumo executivo do artigo"}
            </label>
            <Textarea
              name="sourceSummary"
              placeholder={
                isResearch
                  ? "Explique problema, oportunidade, contexto competitivo e tese principal."
                  : "Explique por que esse artigo importa, qual recorte deve ser preservado e o que precisa virar distribuição."
              }
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">
              {isResearch ? "Notas, fontes e insumos extras" : "Artigo bruto ou texto completo"}
            </label>
            <Textarea
              name="rawArticle"
              placeholder={
                isResearch
                  ? "Opcional. Cole links, pontos de pesquisa, entrevistas, dados ou notas complementares."
                  : "Cole aqui o artigo completo, roteiro, transcrição ou material bruto."
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">
              {isResearch ? "URL da fonte principal" : "URL canônica do conteúdo"}
            </label>
            <Input
              name="sourceUrl"
              placeholder={
                isResearch
                  ? "https://fonte-principal.com/estudo"
                  : "https://seusite.com/artigo-original"
              }
            />
          </div>
        </Card>

        <Card className="rounded-[32px]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="eyebrow text-[var(--ink-soft)]">Canais</p>
              <h3 className="mt-2 text-xl font-semibold">Onde esse job vai viver</h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--ink-soft)]">
                Selecione os canais para gerar variantes e criativos base. Você pode começar amplo e
                restringir depois.
              </p>
            </div>
            <div className="rounded-[22px] bg-[var(--surface-strong)] px-4 py-3 text-sm">
              <span className="font-semibold">{selectedChannels.length}</span> canal(is) ativo(s)
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {channels.map((channel) => {
              const active = selectedChannels.includes(channel.key);

              return (
                <label
                  key={channel.key}
                  className={`rounded-[24px] border p-4 text-sm transition ${
                    active
                      ? "border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_12%,var(--surface))]"
                      : "border-[var(--line)] bg-[var(--surface-contrast)]"
                  }`}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="font-semibold">{channel.label}</span>
                    <input
                      className="h-4 w-4 accent-[var(--accent)]"
                      type="checkbox"
                      name="selectedChannels"
                      value={channel.key}
                      checked={active}
                      onChange={() => toggleChannel(channel.key)}
                    />
                  </span>
                  <span className="mt-3 block text-xs leading-6 text-[var(--ink-soft)]">
                    {channel.key === "linkedin" && "Tese, autoridade e distribuição B2B."}
                    {channel.key === "instagram" && "Narrativa visual, carrossel e recorte rápido."}
                    {channel.key === "x" && "Gancho curto, comentário e repercussão."}
                    {channel.key === "facebook" && "Contexto acessível e compartilhamento."}
                  </span>
                </label>
              );
            })}
          </div>
        </Card>

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-dashed border-[var(--line)] bg-[var(--surface)] px-5 py-4">
          <p className="max-w-2xl text-sm leading-6 text-[var(--ink-soft)]">
            Ao salvar, o sistema registra o job, cria o artigo-mestre inicial, variantes sociais,
            criativos mockados e fluxo de aprovação padrão.
          </p>
          <Button type="submit">Criar job</Button>
        </div>
      </div>

      <div className="grid gap-4">
        <Card className="rounded-[32px] bg-[linear-gradient(160deg,var(--panel)_0%,color-mix(in_srgb,var(--panel-soft)_86%,black)_100%)] text-white">
          <p className="eyebrow text-white/60">Leitura operacional</p>
          <h3 className="mt-2 text-2xl font-semibold">O que sai desta etapa</h3>
          <div className="mt-5 grid gap-3">
            {workflowMoments.map((moment) => {
              const Icon = moment.icon;

              return (
                <div
                  key={moment.title}
                  className="rounded-[24px] border border-white/10 bg-white/6 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-white/10 p-2.5">
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="font-semibold">{moment.title}</p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-white/72">{moment.body}</p>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="rounded-[32px]">
          <p className="eyebrow text-[var(--ink-soft)]">Recomendação</p>
          <h3 className="mt-2 text-xl font-semibold">
            {isResearch ? "Pesquisa primeiro, volume depois" : "Preserve o núcleo do artigo"}
          </h3>
          <p className="mt-4 text-sm leading-7 text-[var(--ink-soft)]">
            {isResearch
              ? "Se a entrada vier de tema aberto, deixe o resumo o mais específico possível. Isso reduz deriva editorial e melhora a qualidade das variantes."
              : "Se a entrada vier de artigo pronto, cole o texto completo e use o resumo para marcar o que não pode ser diluído na adaptação social."}
          </p>
        </Card>

        <Card className="rounded-[32px]">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[var(--surface-strong)] p-2.5">
              <Sparkles className="h-4 w-4 text-[var(--accent)]" />
            </div>
            <div>
              <p className="text-sm font-semibold">Modo atual</p>
              <p className="text-sm text-[var(--ink-soft)]">Fallback local com trilha pronta para banco</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-[var(--ink-soft)]">
            Enquanto a persistência Postgres não entra em modo ativo, o sistema continua funcional com
            store local para não travar o desenvolvimento.
          </p>
        </Card>
      </div>
    </form>
  );
};
