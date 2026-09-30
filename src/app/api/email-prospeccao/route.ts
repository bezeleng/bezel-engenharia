import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { enviarEmail } from "@/lib/email";
import { EMAIL_SESSION_COOKIE, validarTokenSessao } from "@/lib/email-panel-session";
import {
  buscarContatoPorEmail,
  finalizarCampanha,
  registrarCampanha,
  registrarContatoEnviado,
  registrarEnvio,
  salvarContato,
  totalEnviadoHoje,
} from "@/lib/prospeccao-store";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_DIARIO = 50;
const MAX_LOTE = 20;

const contatoSchema = z.object({
  nome: z.string().trim().max(120).optional().default(""),
  email: z.string().trim().email().max(254),
});

const payloadSchema = z.object({
  assunto: z.string().trim().min(3).max(180),
  mensagem: z.string().trim().min(10).max(12000),
  contatos: z.array(contatoSchema).min(1).max(MAX_LOTE),
  teste: z.boolean().optional().default(false),
  emailTeste: z.string().trim().email().max(254).optional(),
  confirmacao: z.literal(true),
});

function escaparHtml(valor: string) {
  return valor
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function personalizar(texto: string, nome: string) {
  return texto.replaceAll("{{nome}}", nome || "contato");
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
        <div style="padding:28px;font-size:15px;line-height:1.7">${corpo}</div>
        <div style="padding:18px 28px;background:#f5f2ed;color:#5f6368;font-size:11px;line-height:1.5">
          Mensagem comercial enviada pela BEZEL a um contato profissional ou institucional.
          Se preferir não receber novos contatos, responda a este e-mail informando “remover”.
        </div>
      </div>
    </div>
  `;
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  if (!validarTokenSessao(cookieStore.get(EMAIL_SESSION_COOKIE)?.value)) {
    return NextResponse.json({ error: "Sessão expirada. Entre novamente no painel." }, { status: 401 });
  }

  const parsed = payloadSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos.", detalhes: parsed.error.flatten() }, { status: 400 });
  }

  const { assunto, mensagem, contatos, teste, emailTeste } = parsed.data;
  const smtpUser = process.env.SMTP_USER;
  if (!smtpUser) return NextResponse.json({ error: "E-mail remetente não configurado." }, { status: 500 });

  const unicos = Array.from(
    new Map(contatos.map((contato) => [contato.email.toLowerCase(), contato])).values()
  );

  if (teste) {
    const texto = personalizar(mensagem, "Contato de teste");
    const assuntoSeguro = personalizar(assunto, "Contato de teste").replace(/[\r\n]+/g, " ").trim();
    const destinatarioTeste = emailTeste?.toLowerCase() || smtpUser.toLowerCase();
    try {
      const info = await enviarEmail({
        destinatario: destinatarioTeste,
        assunto: `[TESTE] ${assuntoSeguro}`,
        html: montarHtml(texto),
        texto,
        nomeRemetente: "BEZEL Engenharia",
      });
      const aceitos = (info.accepted || []).map((item) => String(item).toLowerCase());
      if (!aceitos.includes(destinatarioTeste)) {
        return NextResponse.json({
          error: "O servidor SMTP não confirmou a aceitação do destinatário de teste.",
          smtpResponse: info.response,
          rejeitados: (info.rejected || []).map(String),
        }, { status: 502 });
      }
      return NextResponse.json({
        sucesso: true,
        teste: true,
        totalEnviados: 1,
        totalFalhas: 0,
        destinatarioTeste,
        smtpAceito: true,
        messageId: info.messageId,
        smtpResponse: info.response,
      });
    } catch (error) {
      console.error("Falha no teste de prospecção:", error);
      const detalhe = error instanceof Error ? error.message : "Erro SMTP não identificado.";
      return NextResponse.json({ error: `Falha no envio do teste pelo SMTP: ${detalhe}` }, { status: 502 });
    }
  }

  let enviadosHoje: number;
  try {
    enviadosHoje = await totalEnviadoHoje();
  } catch (error) {
    console.error("Falha ao consultar limite diário:", error);
    return NextResponse.json(
      { error: "O controle de prospecção não está configurado. Verifique SANITY_API_WRITE_TOKEN." },
      { status: 503 }
    );
  }

  const restantes = Math.max(0, MAX_DIARIO - enviadosHoje);
  if (unicos.length > restantes) {
    return NextResponse.json(
      { error: `Limite diário: restam ${restantes} envio(s) hoje. Ajuste a lista antes de continuar.` },
      { status: 429 }
    );
  }

  const enviados: string[] = [];
  const falhas: Array<{ email: string; erro: string }> = [];
  const bloqueados: string[] = [];
  const campanha = await registrarCampanha({
    assunto,
    mensagem,
    totalDestinatarios: unicos.length,
  });

  for (const contatoEntrada of unicos) {
    const email = contatoEntrada.email.toLowerCase();
    const existente = await buscarContatoPorEmail(email);

    if (existente?.optOut) {
      bloqueados.push(email);
      await registrarEnvio({
        campanhaId: campanha._id,
        nome: contatoEntrada.nome || existente.nome,
        email,
        assunto,
        status: "BLOQUEADO",
        erro: "Contato marcado como não enviar.",
      });
      continue;
    }

    const salvo = await salvarContato({
      nome: contatoEntrada.nome || existente?.nome || "",
      email,
      status: existente?.status || "NOVO",
    });

    const textoPersonalizado = personalizar(mensagem, contatoEntrada.nome || existente?.nome || "");
    const assuntoSeguro = personalizar(assunto, contatoEntrada.nome || existente?.nome || "")
      .replace(/[\r\n]+/g, " ")
      .trim();

    try {
      const info = await enviarEmail({
        destinatario: email,
        assunto: assuntoSeguro,
        html: montarHtml(textoPersonalizado),
        texto: textoPersonalizado,
        nomeRemetente: "BEZEL Engenharia",
      });
      const aceitos = (info.accepted || []).map((item) => String(item).toLowerCase());
      if (!aceitos.includes(email)) {
        const rejeitados = (info.rejected || []).map(String).join(", ");
        throw new Error(
          `SMTP não confirmou o destinatário. ${rejeitados ? `Rejeitado: ${rejeitados}. ` : ""}${info.response || ""}`.trim()
        );
      }

      enviados.push(email);
      await registrarEnvio({
        campanhaId: campanha._id,
        nome: contatoEntrada.nome || existente?.nome || "",
        email,
        assunto: assuntoSeguro,
        status: "ENVIADO",
        smtpMessageId: info.messageId,
        smtpResponse: info.response,
      });
      if (!existente || existente.status === "NOVO") await registrarContatoEnviado(salvo._id);
    } catch (error) {
      console.error("Falha no envio de prospecção:", email, error);
      const detalhe = error instanceof Error ? error.message.slice(0, 500) : "Falha no envio pelo servidor SMTP.";
      falhas.push({ email, erro: detalhe });
      await registrarEnvio({
        campanhaId: campanha._id,
        nome: contatoEntrada.nome || existente?.nome || "",
        email,
        assunto: assuntoSeguro,
        status: "FALHA",
        erro: detalhe,
      });
    }
  }

  await finalizarCampanha(campanha._id, enviados.length, falhas.length, bloqueados.length);

  return NextResponse.json({
    sucesso: falhas.length === 0,
    teste: false,
    enviados,
    falhas,
    bloqueados,
    totalEnviados: enviados.length,
    totalFalhas: falhas.length,
    totalBloqueados: bloqueados.length,
    restantesHoje: Math.max(0, restantes - enviados.length),
  });
}
