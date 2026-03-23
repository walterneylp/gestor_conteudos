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
];

export const JobIntakeForm = () => (
  <form action={createJobAction} className="page-grid">
    <Card className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <label className="text-sm font-semibold">Caminho inicial</label>
        <Select name="origin" defaultValue="research">
          <option value="research">Pesquisar assunto</option>
          <option value="article">Enviar artigo pronto</option>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold">Titulo do job</label>
        <Input name="title" placeholder="Ex.: IA para operacoes editoriais" required />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold">Objetivo</label>
        <Input
          name="objective"
          placeholder="Ex.: gerar autoridade, pipeline organico, educacao do mercado"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold">Publico</label>
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

      <div className="space-y-2 md:col-span-2">
        <label className="text-sm font-semibold">Resumo do briefing ou artigo</label>
        <Textarea
          name="sourceSummary"
          placeholder="Cole aqui o briefing, contexto, tese central ou resumo do artigo enviado."
          required
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <label className="text-sm font-semibold">Artigo bruto ou texto complementar</label>
        <Textarea
          name="rawArticle"
          placeholder="Opcional. Use para colar um artigo pronto, roteiro, ou notas extensas."
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <label className="text-sm font-semibold">URL da fonte principal</label>
        <Input name="sourceUrl" placeholder="https://..." />
      </div>
    </Card>

    <Card className="space-y-4">
      <div>
        <p className="eyebrow text-[var(--ink-soft)]">Destinos sociais</p>
        <h3 className="mt-2 text-xl font-semibold">Selecione os canais do job</h3>
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        {channels.map((channel) => (
          <label
            key={channel.key}
            className="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm font-medium"
          >
            <input
              className="h-4 w-4 accent-[var(--accent)]"
              type="checkbox"
              name="selectedChannels"
              value={channel.key}
              defaultChecked
            />
            {channel.label}
          </label>
        ))}
      </div>
    </Card>

    <div className="flex flex-wrap items-center justify-between gap-4">
      <p className="max-w-2xl text-sm leading-6 text-[var(--ink-soft)]">
        Ao salvar, o sistema cria artigo-mestre, variantes sociais, criativos base e fluxo de aprovacao com dados mockados, pronto para acoplar providers reais depois.
      </p>
      <Button type="submit">Criar job</Button>
    </div>
  </form>
);
