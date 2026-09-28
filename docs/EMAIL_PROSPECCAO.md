# Painel de Prospecção BEZEL — V2

Área privada: `/email`.

## O que a V2 adiciona

- login com sessão HTTP-only de 8 horas; a senha não é mais enviada em cada disparo;
- rota `/email` protegida no servidor;
- CRM de contatos com funil: Novo → Contatado → Respondeu → Visita → Proposta → Negociação → Cliente;
- dashboard com contatos, envios do dia, saldo diário, follow-ups e opt-outs;
- histórico persistente dos envios;
- limite persistente de 20 e-mails comerciais por dia;
- bloqueio de contatos marcados como “não enviar”;
- follow-up por data;
- cadastro automático dos destinatários enviados;
- campanhas e histórico armazenados no Sanity;
- botão de teste continua enviando somente para a caixa BEZEL e não consome o limite diário.

## Variáveis da Vercel

Já utilizadas:

```
EMAIL_PANEL_PASSWORD=<senha forte e exclusiva>
SMTP_HOST=...
SMTP_PORT=...
SMTP_USER=...
SMTP_PASSWORD=...
NEXT_PUBLIC_SANITY_PROJECT_ID=...
NEXT_PUBLIC_SANITY_DATASET=...
NEXT_PUBLIC_SANITY_API_VERSION=...
```

Nova variável obrigatória para a V2:

```
SANITY_API_WRITE_TOKEN=<token privado com permissão de escrita no dataset>
```

O token deve existir apenas no servidor/Vercel. Nunca use prefixo `NEXT_PUBLIC_` para ele e nunca coloque o valor no Git.

Depois de adicionar ou alterar variáveis na Vercel, faça um novo deployment.

## Segurança

A sessão é assinada no servidor usando o segredo do painel e armazenada em cookie `HttpOnly`, `SameSite=Strict` e `Secure` em produção. APIs de CRM e envio validam a sessão no servidor.

## Envio

Cada destinatário recebe mensagem individual. Formatos aceitos:

```
Instituição | email@dominio.com
Instituição <email@dominio.com>
email@dominio.com
```

Use `{{nome}}` no assunto ou corpo para personalização.

## Limites

A V2 mantém no máximo 20 envios comerciais registrados por dia. Testes para a própria BEZEL não entram no limite. Contatos em opt-out são bloqueados antes do SMTP.

O controle foi desenhado para uso interno por uma única equipe. Se no futuro houver múltiplos operadores enviando simultaneamente, o limite diário deve migrar para um contador transacional/atômico.
