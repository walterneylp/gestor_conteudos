import { NextResponse } from "next/server";
import { z } from "zod";
import { updateSearchProviderSecretState } from "@/lib/store";

const schema = z.object({
  providerKey: z.enum(["brave", "serper"]),
  secretConfigured: z.boolean(),
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    await updateSearchProviderSecretState(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Falha ao salvar configuracao do provider de busca.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
