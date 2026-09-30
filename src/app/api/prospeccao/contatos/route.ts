import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { EMAIL_SESSION_COOKIE, validarTokenSessao } from "@/lib/email-panel-session";
import { atualizarContato, excluirContato, excluirContatos, salvarContato } from "@/lib/prospeccao-store";

export const runtime = "nodejs";

const status = z.enum(["NOVO","CONTATADO","RESPONDEU","VISITA","PROPOSTA","NEGOCIACAO","CLIENTE","ARQUIVADO"]);

const criarSchema = z.object({
  nome: z.string().trim().max(120).optional().default(""),
  email: z.string().trim().email().max(254),
  cidade: z.string().trim().max(120).optional().default(""),
  segmento: z.string().trim().max(120).optional().default(""),
  status: status.optional(),
  proximoFollowUpEm: z.string().datetime().nullable().optional(),
  observacoes: z.string().max(3000).optional().default(""),
});

const atualizarSchema = z.object({
  id: z.string().min(1),
  status: status.optional(),
  optOut: z.boolean().optional(),
  proximoFollowUpEm: z.string().datetime().nullable().optional(),
  observacoes: z.string().max(3000).optional(),
});

async function autorizado() {
  const cookieStore = await cookies();
  return validarTokenSessao(cookieStore.get(EMAIL_SESSION_COOKIE)?.value);
}

export async function POST(request: Request) {
  if (!(await autorizado())) return NextResponse.json({ error: "Sessão expirada." }, { status: 401 });
  const parsed = criarSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });

  try {
    const contato = await salvarContato(parsed.data);
    return NextResponse.json({ contato });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Não foi possível salvar o contato." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!(await autorizado())) return NextResponse.json({ error: "Sessão expirada." }, { status: 401 });
  const parsed = atualizarSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });

  try {
    const contato = await atualizarContato(parsed.data);
    return NextResponse.json({ contato });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Não foi possível atualizar o contato." }, { status: 500 });
  }
}


export async function DELETE(request: Request) {
  if (!(await autorizado())) return NextResponse.json({ error: "Sessão expirada." }, { status: 401 });
  const parsed = z.union([
    z.object({ id: z.string().min(1) }),
    z.object({ ids: z.array(z.string().min(1)).min(1).max(500) }),
  ]).safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  try {
    if ("ids" in parsed.data) {
      const excluidos = await excluirContatos(parsed.data.ids);
      return NextResponse.json({ ok: true, excluidos });
    }
    await excluirContato(parsed.data.id);
    return NextResponse.json({ ok: true, excluidos: 1 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Não foi possível excluir o contato." }, { status: 500 });
  }
}
