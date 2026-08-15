// src/lib/email.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true, // true para porta 465 (SSL/TLS)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface EnviarEmailParams {
  assunto: string;
  html: string;
  replyTo?: string;
}

export async function enviarEmail({
  assunto,
  html,
  replyTo,
}: EnviarEmailParams) {
  await transporter.sendMail({
    from: `"Site BEZEL Engenharia" <${process.env.SMTP_USER}>`,
    to: process.env.SMTP_USER, // envia para a própria caixa de contato
    replyTo,
    subject: assunto,
    html,
  });
}