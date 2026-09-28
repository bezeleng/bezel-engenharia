import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { enviarEmail } from "@/lib/email";

export const runtime = "nodejs";

const MAX_DESTINATARIOS = 20;

const contatoSchema = z.object({
  nome: z.string().trim().max(120).optional().default(""),
  email: z.string().trim().email().max(254),
});

const payloadSchema = z.object({
  senha: z.string().min(1).max(200),
  assunto: z.string().trim().min(3).max(180),
  mensagem: z.string().trim().min(10).max(12000),
  contatos: z.array(contatoSchema).min(1).max(MAX_DESTINATARIOS),
  teste: z.boolean().optional().default(false),
  confirmacao: z.literal(true),
});

function senhaValida(recebida: string) {
  const esperada = process.env.EMAIL_PANEL_PASSWORD;
  if (!esperada) return false;

  const a = Buffer.from(recebida);
  const b = Buffer.from(esperada);
  return a.length === b.length && timingSafeEqual(a, b);
}

function escaparHtml(valor: string) {
  return valor
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function personalizar(texto: string, nome: string) {
  return texto.replaceAll("{{nome}}", nome || "sua instituição");
}

function montarHtml(mensagem: string) {
  const corpo = escaparHtml(mensagem).replaceAll("\n", "<br />");

  return `
    <div style="margin:0;background:#f5f2ed;padding:28px 12px;font-family:Arial,Helvetica,sans-serif;color:#1c1c1c">
      <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #e7e2da;border-radius:12px;overflow:hidden">
        <div style="background:#193451;padding:22px 28px">
          <div style="color:#c3a06a;font-size:22px;font-weight:700;letter-spacing:.08em">BEZEL</div>
          <div style="color:#ffffff;font-size:12px;margin-top:4px">Engenharia • Arquitetura • Gestão de Obras</div>
        </div>
        <div style="padding:28px;font-size:15px;line-height:1.7">
          ${corpo}
        </div>
        <div style="padding:18px 28px;background:#f5f2ed;color:#5f6368;font-size:11px;line-height:1.5">
          Mensagem comercial enviada pela BEZEL a um contato institucional.
          Se preferir não receber novos contatos, responda a este e-mail informando “remover”.
        </div>
      </div>
    </div>
  `;
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  const resultado = payloadSchema.safeParse(body);

  if (!resultado.success) {
    return NextResponse.json(
      { error: "Dados inválidos.", detalhes: resultado.error.flatten() },
      { status: 400 }
    );
  }

  const { senha, assunto, mensagem, contatos, teste } = resultado.data;

  if (!senhaValida(senha)) {
    return NextResponse.json({ error: "Senha do painel inválida." }, { status: 401 });
  }

  const unicos = Array.from(
    new Map(contatos.map((contato) => [contato.email.toLowerCase(), contato])).values()
  );

  if (unicos.length > MAX_DESTINATARIOS) {
    return NextResponse.json(
      { error: `O limite por envio é de ${MAX_DESTINATARIOS} destinatários.` },
      { status: 400 }
    );
  }

  const smtpUser = process.env.SMTP_USER;
  if (!smtpUser) {
    return NextResponse.json(
      { error: "E-mail remetente não configurado no servidor." },
      { status: 500 }
    );
  }

  const destinatarios = teste
    ? [{ nome: "TESTE — BEZEL", email: smtpUser }]
    : unicos;

  const enviados: string[] = [];
  const falhas: Array<{ email: string; erro: string }> = [];

  for (const contato of destinatarios) {
    const textoPersonalizado = personalizar(mensagem, contato.nome);
    const assuntoSeguro = personalizar(assunto, contato.nome)
      .replace(/[\r\n]+/g, " ")
      .trim();

    try {
      await enviarEmail({
        destinatario: contato.email,
        assunto: teste ? `[TESTE] ${assuntoSeguro}` : assuntoSeguro,
        html: montarHtml(textoPersonalizado),
        texto: textoPersonalizado,
        nomeRemetente: "BEZEL Engenharia",
      });
      enviados.push(contato.email);
    } catch (error) {
      console.error("Falha no envio de prospecção:", contato.email, error);
      falhas.push({
        email: contato.email,
        erro: "Falha no envio pelo servidor SMTP.",
      });
    }
  }

  return NextResponse.json({
    sucesso: falhas.length === 0,
    teste,
    enviados,
    falhas,
    totalEnviados: enviados.length,
    totalFalhas: falhas.length,
  });
}
