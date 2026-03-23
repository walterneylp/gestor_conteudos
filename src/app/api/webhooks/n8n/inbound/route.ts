import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { verifySignature } from "@/lib/hmac";
import { applyApprovalDecision } from "@/lib/store";

export async function POST(request: Request) {
  const raw = await request.text();

  if (env.n8nInboundSecret) {
    const signature = request.headers.get("x-gestor-signature") || undefined;

    if (!verifySignature(raw, env.n8nInboundSecret, signature)) {
      return NextResponse.json({ error: "invalid signature" }, { status: 401 });
    }
  }

  const body = JSON.parse(raw) as {
    jobId: string;
    approverEmail: string;
    decision: "approved" | "rejected" | "needs_changes" | "approved_with_comment";
    comment?: string;
  };

  const success = await applyApprovalDecision({
    jobId: body.jobId,
    approverEmail: body.approverEmail,
    decision: body.decision,
    comment: body.comment || "",
  });

  if (!success) {
    return NextResponse.json({ error: "job not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
