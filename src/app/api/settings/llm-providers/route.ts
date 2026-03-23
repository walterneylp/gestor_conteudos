import { NextResponse } from "next/server";
import { z } from "zod";
import { updateLlmProvider } from "@/lib/store";

const modelSchema = z.object({
  id: z.string(),
  label: z.string(),
  contextWindow: z.number().optional(),
  modalities: z.array(z.string()).optional(),
});

const schema = z.object({
  providerKey: z.enum(["openai", "groq", "openrouter", "anthropic", "gemini"]),
  enabled: z.boolean(),
  priority: z.number().int().min(1).max(5),
  selectedModel: z.string().optional(),
  availableModels: z.array(modelSchema).optional(),
  secretConfigured: z.boolean().optional(),
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    await updateLlmProvider(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao salvar configuracao da LLM.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
