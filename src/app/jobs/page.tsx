import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { listJobs } from "@/lib/store";
import { formatDateTime } from "@/lib/utils";

export default async function JobsPage() {
  const jobs = await listJobs();

  return (
    <div className="page-grid">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow text-[var(--ink-soft)]">Pipeline de conteudo</p>
          <h1 className="section-title mt-2">Jobs editoriais</h1>
        </div>
        <Link href="/jobs/new">
          <Button>Novo job</Button>
        </Link>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[var(--surface-strong)] text-[var(--ink-soft)]">
              <tr>
                <th className="px-6 py-4 font-semibold">Titulo</th>
                <th className="px-6 py-4 font-semibold">Origem</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Canais</th>
                <th className="px-6 py-4 font-semibold">Atualizado</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="border-t border-[var(--line)] bg-white">
                  <td className="px-6 py-4">
                    <Link href={`/jobs/${job.id}`} className="font-semibold text-[var(--ink)] hover:text-[var(--accent)]">
                      {job.title}
                    </Link>
                    <p className="mt-1 text-[var(--ink-soft)]">{job.objective}</p>
                  </td>
                  <td className="px-6 py-4">{job.origin}</td>
                  <td className="px-6 py-4">
                    <Badge color={job.status === "approved" ? "success" : "accent"}>{job.status}</Badge>
                  </td>
                  <td className="px-6 py-4">{job.selectedChannels.join(", ")}</td>
                  <td className="px-6 py-4 text-[var(--ink-soft)]">{formatDateTime(job.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
