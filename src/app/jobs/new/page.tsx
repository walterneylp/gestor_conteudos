import { JobIntakeForm } from "@/components/jobs/job-intake-form";
import { Card } from "@/components/ui/card";

export default function NewJobPage() {
  return (
    <div className="page-grid">
      <div>
        <p className="eyebrow text-[var(--ink-soft)]">Intake</p>
        <h1 className="section-title mt-2">Criar novo job</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--ink-soft)]">
          O fluxo inicial respeita o PRD: o usuario escolhe entre pesquisar um tema ou enviar um artigo pronto, define contexto editorial e seleciona os canais sociais que receberao adaptacoes especificas.
        </p>
      </div>

      <Card className="bg-[rgba(16,42,67,0.04)]">
        <p className="text-sm leading-7 text-[var(--ink-soft)]">
          Resultado desta etapa: job registrado, artigo-mestre inicial, variantes sociais base, criativos mockados, aprovadores padrao e pacote pronto para n8n.
        </p>
      </Card>

      <JobIntakeForm />
    </div>
  );
}
