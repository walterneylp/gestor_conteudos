import { NextResponse } from "next/server";
import { z } from "zod";
import { discoverProviderModels } from "@/lib/provider-models";

const schema = z.object({
  providerKey: z.enum(["openai", "groq", "openrouter", "anthropic", "gemini"]),
  apiKey: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const models = await discoverProviderModels(body);

    return NextResponse.json({ models });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao descobrir modelos.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
