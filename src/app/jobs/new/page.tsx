import { JobIntakeForm } from "@/components/jobs/job-intake-form";
import { Card } from "@/components/ui/card";

export default function NewJobPage() {
  return (
    <div className="page-grid">
      <section className="grid gap-4 xl:grid-cols-[1.12fr_0.88fr]">
        <Card className="rounded-[34px] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--surface)_70%,transparent),var(--surface-strong))]">
          <p className="eyebrow text-[var(--ink-soft)]">Intake</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Criar novo job</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--ink-soft)]">
            A entrada agora foi redesenhada como cockpit de captura editorial: menos formulário cru,
            mais contexto, direção operacional e clareza de destino.
          </p>
        </Card>

        <Card className="rounded-[34px] bg-[var(--surface-contrast)]">
          <p className="text-sm leading-7 text-[var(--ink-soft)]">
            Resultado esperado: job registrado, artigo-mestre inicial, variantes por rede, criativos
            base, fluxo de aprovação e pacote preparado para integrações futuras.
          </p>
        </Card>
      </section>

      <JobIntakeForm />
    </div>
  );
}
