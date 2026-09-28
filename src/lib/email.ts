// src/lib/email.ts
import nodemailer from "nodemailer";

const smtpPort = Number(process.env.SMTP_PORT || 465);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: smtpPort,
  secure: smtpPort === 465,
  pool: true,
  maxConnections: 2,
  maxMessages: 50,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface EnviarEmailParams {
  assunto: string;
  html: string;
  replyTo?: string;
  destinatario?: string;
  nomeRemetente?: string;
  texto?: string;
}

export async function enviarEmail({
  assunto,
  html,
  replyTo,
  destinatario,
  nomeRemetente = "BEZEL Engenharia",
  texto,
}: EnviarEmailParams) {
  const smtpUser = process.env.SMTP_USER;

  if (!smtpUser) {
    throw new Error("SMTP_USER não configurado.");
  }

  return transporter.sendMail({
    from: `"${nomeRemetente}" <${smtpUser}>`,
    to: destinatario ?? smtpUser,
    replyTo: replyTo ?? smtpUser,
    subject: assunto,
    text: texto,
    html,
  });
}
