import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { signPayload } from "@/lib/hmac";
import { getDeliveryPayload } from "@/lib/store";

export async function POST(request: Request) {
  const body = (await request.json()) as { jobId?: string };

  if (!body.jobId) {
    return NextResponse.json({ error: "jobId is required" }, { status: 400 });
  }

  const payload = await getDeliveryPayload(body.jobId);

  if (!payload) {
    return NextResponse.json({ error: "job not found" }, { status: 404 });
  }

  const serialized = JSON.stringify(payload);
  const signature = env.n8nOutboundSecret
    ? signPayload(serialized, env.n8nOutboundSecret)
    : undefined;

  return NextResponse.json({
    payload,
    signature,
    note: "Use este pacote para disparar o fluxo de aprovacao no n8n.",
  });
}
