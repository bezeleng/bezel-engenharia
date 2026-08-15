import { NextResponse } from "next/server";
import { orcamentoSchema } from "@/lib/validations/orcamento";
import { enviarEmail } from "@/lib/email";

const tipoObraLabel: Record<string, string> = {
  residencial: "Residencial",
  comercial: "Comercial",
  industrial: "Industrial",
  institucional: "Institucional",
};

const prazoLabel: Record<string, string> = {
  imediato: "Imediato",
  "3_meses": "Até 3 meses",
  "6_meses": "Até 6 meses",
  sem_prazo: "Sem prazo definido",
};

export async function POST(request: Request) {
  const body = await request.json();
  const resultado = orcamentoSchema.safeParse(body);

  if (!resultado.success) {
    return NextResponse.json(
      { error: "Dados inválidos.", detalhes: resultado.error.flatten() },
      { status: 400 }
    );
  }

  const { nome, email, telefone, tipoObra, metragem, prazo, mensagem } =
    resultado.data;

  try {
    await enviarEmail({
      assunto: `Novo pedido de orçamento — ${nome}`,
      replyTo: email,
      html: `
        <h2>Novo pedido de orçamento</h2>
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Telefone:</strong> ${telefone}</p>
        <p><strong>Tipo de obra:</strong> ${tipoObraLabel[tipoObra]}</p>
        <p><strong>Metragem:</strong> ${metragem} m²</p>
        <p><strong>Prazo:</strong> ${prazoLabel[prazo]}</p>
        ${mensagem ? `<p><strong>Observações:</strong></p><p>${mensagem}</p>` : ""}
      `,
    });
  } catch (error) {
    console.error("Erro ao enviar e-mail de orçamento:", error);
    return NextResponse.json(
      { error: "Não foi possível enviar sua solicitação." },
      { status: 500 }
    );
  }

  return NextResponse.json({ sucesso: true });
}