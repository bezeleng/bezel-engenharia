// src/app/api/orcamento/route.ts
import { NextResponse } from "next/server";
import { orcamentoSchema } from "@/lib/validations/orcamento";

export async function POST(request: Request) {
  const body = await request.json();
  const resultado = orcamentoSchema.safeParse(body);

  if (!resultado.success) {
    return NextResponse.json(
      { error: "Dados inválidos.", detalhes: resultado.error.flatten() },
      { status: 400 }
    );
  }

  // TODO: integrar envio de e-mail (Resend/SendGrid) em etapa futura.
  console.log("Novo pedido de orçamento recebido:", resultado.data);

  return NextResponse.json({ sucesso: true });
}