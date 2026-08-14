// src/components/forms/ContatoForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contatoSchema, type ContatoFormData } from "@/lib/validations/contato";
import { Button } from "@/components/ui/Button";

export function ContatoForm() {
  const [status, setStatus] = useState<"idle" | "enviando" | "sucesso" | "erro">(
    "idle"
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContatoFormData>({
    resolver: zodResolver(contatoSchema),
  });

  async function onSubmit(dados: ContatoFormData) {
    setStatus("enviando");
    try {
      const resposta = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      if (!resposta.ok) throw new Error("Falha no envio.");

      setStatus("sucesso");
      reset();
    } catch {
      setStatus("erro");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div>
        <label htmlFor="nome" className="block text-sm font-medium text-navy">
          Nome
        </label>
        <input
          id="nome"
          {...register("nome")}
          className="mt-1 w-full rounded-md border border-navy/20 px-4 py-2"
        />
        {errors.nome && (
          <p className="mt-1 text-sm text-red-600">{errors.nome.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-navy">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className="mt-1 w-full rounded-md border border-navy/20 px-4 py-2"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="telefone" className="block text-sm font-medium text-navy">
          Telefone
        </label>
        <input
          id="telefone"
          type="tel"
          {...register("telefone")}
          className="mt-1 w-full rounded-md border border-navy/20 px-4 py-2"
        />
        {errors.telefone && (
          <p className="mt-1 text-sm text-red-600">{errors.telefone.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="mensagem" className="block text-sm font-medium text-navy">
          Mensagem
        </label>
        <textarea
          id="mensagem"
          rows={5}
          {...register("mensagem")}
          className="mt-1 w-full rounded-md border border-navy/20 px-4 py-2"
        />
        {errors.mensagem && (
          <p className="mt-1 text-sm text-red-600">{errors.mensagem.message}</p>
        )}
      </div>

      <Button variant="primary" disabled={status === "enviando"}>
        {status === "enviando" ? "Enviando..." : "Enviar Mensagem"}
      </Button>

      {status === "sucesso" && (
        <p className="text-sm text-green-700">
          Mensagem enviada com sucesso! Entraremos em contato em breve.
        </p>
      )}
      {status === "erro" && (
        <p className="text-sm text-red-600">
          Não foi possível enviar. Tente novamente em instantes.
        </p>
      )}
    </form>
  );
}