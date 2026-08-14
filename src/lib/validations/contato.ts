// src/lib/validations/contato.ts
import { z } from "zod";

export const contatoSchema = z.object({
  nome: z
    .string()
    .min(2, "Informe seu nome completo."),
  email: z
    .string()
    .email("Informe um e-mail válido."),
  telefone: z
    .string()
    .min(10, "Informe um telefone válido, com DDD."),
  mensagem: z
    .string()
    .min(10, "A mensagem precisa ter pelo menos 10 caracteres."),
});

export type ContatoFormData = z.infer<typeof contatoSchema>;