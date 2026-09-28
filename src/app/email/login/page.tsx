"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginEmailPage() {
  const router = useRouter();
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function entrar(e: FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    try {
      const response = await fetch("/api/email-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senha }),
      });
      const data = await response.json();
      if (!response.ok) {
        setErro(data.error || "Não foi possível entrar.");
        return;
      }
      router.replace("/email");
      router.refresh();
    } catch {
      setErro("Erro de comunicação com o servidor.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f2ed] px-4 py-16 text-[#1c1c1c]">
      <div className="mx-auto max-w-md rounded-2xl bg-white p-7 shadow-sm">
        <div className="font-display text-3xl tracking-wider text-[#c3a06a]">BEZEL</div>
        <h1 className="mt-3 text-2xl font-semibold text-[#193451]">Prospecção</h1>
        <p className="mt-2 text-sm text-slate-500">Área privada. A sessão permanece ativa por até 8 horas.</p>
        <form onSubmit={entrar} className="mt-7">
          <label className="text-sm font-semibold text-[#193451]">Senha do painel</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            autoFocus
            autoComplete="current-password"
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#c3a06a]"
          />
          <button
            type="submit"
            disabled={carregando || !senha}
            className="mt-4 w-full rounded-xl bg-[#193451] px-5 py-3 font-semibold text-white disabled:opacity-40"
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>
          {erro && <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</div>}
        </form>
      </div>
    </main>
  );
}
