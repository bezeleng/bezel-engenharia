// src/components/forms/OrcamentoForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  orcamentoSchema,
  type OrcamentoFormData,
} from "@/lib/validations/orcamento";
import { Button } from "@/components/ui/Button";

const tiposObra = [
  { value: "residencial", label: "Residencial" },
  { value: "comercial", label: "Comercial" },
  { value: "industrial", label: "Industrial" },
  { value: "institucional", label: "Institucional" },
];

const prazos = [
  { value: "imediato", label: "Imediato" },
  { value: "3_meses", label: "Até 3 meses" },
  { value: "6_meses", label: "Até 6 meses" },
  { value: "sem_prazo", label: "Sem prazo definido" },
];

export function OrcamentoForm() {
  const [status, setStatus] = useState
    <"idle" | "enviando" | "sucesso" | "erro"
  >("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OrcamentoFormData>({
    resolver: zodResolver(orcamentoSchema),
  });

  async function onSubmit(dados: OrcamentoFormData) {
    setStatus("enviando");
    try {
      const resposta = await fetch("/api/orcamento", {
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
      <div className="grid gap-6 sm:grid-cols-2">
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
            <p className="mt-1 text-sm text-red-600">
              {errors.telefone.message}
            </p>
          )}
        </div>
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

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="tipoObra" className="block text-sm font-medium text-navy">
            Tipo de Obra
          </label>
          <select
            id="tipoObra"
            {...register("tipoObra")}
            defaultValue=""
            className="mt-1 w-full rounded-md border border-navy/20 bg-white px-4 py-2"
          >
            <option value="" disabled>
              Selecione...
            </option>
            {tiposObra.map((tipo) => (
              <option key={tipo.value} value={tipo.value}>
                {tipo.label}
              </option>
            ))}
          </select>
          {errors.tipoObra && (
            <p className="mt-1 text-sm text-red-600">
              {errors.tipoObra.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="metragem" className="block text-sm font-medium text-navy">
            Metragem (m²)
          </label>
          <input
            id="metragem"
            type="number"
            {...register("metragem")}
            className="mt-1 w-full rounded-md border border-navy/20 px-4 py-2"
          />
          {errors.metragem && (
            <p className="mt-1 text-sm text-red-600">
              {errors.metragem.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="prazo" className="block text-sm font-medium text-navy">
          Prazo Desejado
        </label>
        <select
          id="prazo"
          {...register("prazo")}
          defaultValue=""
          className="mt-1 w-full rounded-md border border-navy/20 bg-white px-4 py-2"
        >
          <option value="" disabled>
            Selecione...
          </option>
          {prazos.map((prazo) => (
            <option key={prazo.value} value={prazo.value}>
              {prazo.label}
            </option>
          ))}
        </select>
        {errors.prazo && (
          <p className="mt-1 text-sm text-red-600">{errors.prazo.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="mensagem" className="block text-sm font-medium text-navy">
          Observações (opcional)
        </label>
        <textarea
          id="mensagem"
          rows={4}
          {...register("mensagem")}
          className="mt-1 w-full rounded-md border border-navy/20 px-4 py-2"
        />
      </div>

      <Button variant="primary" disabled={status === "enviando"}>
        {status === "enviando" ? "Enviando..." : "Solicitar Orçamento"}
      </Button>

      {status === "sucesso" && (
        <p className="text-sm text-green-700">
          Solicitação enviada com sucesso! Entraremos em contato em breve.
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