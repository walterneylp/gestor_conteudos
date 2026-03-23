import { Card } from "@/components/ui/card";

export const StatCard = ({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint: string;
}) => (
  <Card className="space-y-4 rounded-[28px] bg-[color-mix(in_srgb,var(--surface)_88%,transparent)]">
    <p className="eyebrow text-[var(--ink-soft)]">{label}</p>
    <div className="text-4xl font-semibold tracking-tight">{value}</div>
    <p className="text-sm leading-6 text-[var(--ink-soft)]">{hint}</p>
  </Card>
);
