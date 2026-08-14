// src/lib/validations/orcamento.ts
import { z } from "zod";

export const orcamentoSchema = z.object({
  nome: z.string().min(2, "Informe seu nome completo."),
  email: z.string().email("Informe um e-mail válido."),
  telefone: z.string().min(10, "Informe um telefone válido, com DDD."),
  tipoObra: z.enum(
    ["residencial", "comercial", "industrial", "institucional"],
    { message: "Selecione o tipo de obra." }
  ),
  metragem: z.coerce
    .number({ message: "Informe a metragem em números." })
    .positive("A metragem deve ser maior que zero."),
  prazo: z.enum(["imediato", "3_meses", "6_meses", "sem_prazo"], {
    message: "Selecione o prazo desejado.",
  }),
  mensagem: z.string().optional(),
});

export type OrcamentoFormData = z.infer<typeof orcamentoSchema>;