// src/app/api/contato/route.ts
import { NextResponse } from "next/server";
import { contatoSchema } from "@/lib/validations/contato";

export async function POST(request: Request) {
  const body = await request.json();
  const resultado = contatoSchema.safeParse(body);

  if (!resultado.success) {
    return NextResponse.json(
      { error: "Dados inválidos.", detalhes: resultado.error.flatten() },
      { status: 400 }
    );
  }

  // TODO: integrar envio de e-mail (Resend/SendGrid) em etapa futura.
  console.log("Novo contato recebido:", resultado.data);

  return NextResponse.json({ sucesso: true });
}