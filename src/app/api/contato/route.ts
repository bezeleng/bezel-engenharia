import { NextResponse } from "next/server";
import { contatoSchema } from "@/lib/validations/contato";
import { enviarEmail } from "@/lib/email";

export async function POST(request: Request) {
  const body = await request.json();
  const resultado = contatoSchema.safeParse(body);

  if (!resultado.success) {
    return NextResponse.json(
      { error: "Dados inválidos.", detalhes: resultado.error.flatten() },
      { status: 400 }
    );
  }

  const { nome, email, telefone, mensagem } = resultado.data;

  try {
    await enviarEmail({
      assunto: `Novo contato pelo site — ${nome}`,
      replyTo: email,
      html: `
        <h2>Novo contato pelo site</h2>
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Telefone:</strong> ${telefone}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${mensagem}</p>
      `,
    });
  } catch (error) {
    console.error("Erro ao enviar e-mail de contato:", error);
    return NextResponse.json(
      { error: "Não foi possível enviar sua mensagem." },
      { status: 500 }
    );
  }

  return NextResponse.json({ sucesso: true });
}