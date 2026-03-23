import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { verifySignature } from "@/lib/hmac";
import { createJobFromWebhook } from "@/lib/store";
import type { SocialChannel } from "@/lib/types";

export async function POST(request: Request) {
  const raw = await request.text();

  if (env.externalWebhookSecret) {
    const signature = request.headers.get("x-gestor-signature") || undefined;

    if (!verifySignature(raw, env.externalWebhookSecret, signature)) {
      return NextResponse.json({ error: "invalid signature" }, { status: 401 });
    }
  }

  const body = JSON.parse(raw) as {
    title: string;
    objective: string;
    audience: string;
    language?: string;
    tone?: string;
    depth?: string;
    desiredLength?: string;
    sourceSummary: string;
    rawArticle?: string;
    sourceUrl?: string;
    selectedChannels?: SocialChannel[];
    externalId?: string;
  };

  const job = await createJobFromWebhook({
    origin: "webhook",
    title: body.title,
    objective: body.objective,
    audience: body.audience,
    language: body.language || "pt-BR",
    tone: body.tone || "Consultivo e direto",
    depth: body.depth || "Tatico",
    desiredLength: body.desiredLength || "1.000 palavras",
    sourceSummary: body.sourceSummary,
    rawArticle: body.rawArticle,
    sourceUrl: body.sourceUrl,
    selectedChannels: body.selectedChannels || ["linkedin", "instagram"],
    externalId: body.externalId,
  });

  return NextResponse.json({ ok: true, jobId: job.id });
}
