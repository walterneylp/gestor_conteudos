import { NextResponse } from "next/server";
import { z } from "zod";
import { updateSearchRouting } from "@/lib/store";

const schema = z.object({
  primary: z.enum(["brave", "serper"]),
  fallback: z.enum(["brave", "serper"]),
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());

    if (body.primary === body.fallback) {
      return NextResponse.json(
        { error: "Primaria e fallback precisam ser diferentes." },
        { status: 400 },
      );
    }

    await updateSearchRouting(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao salvar roteamento de busca.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
