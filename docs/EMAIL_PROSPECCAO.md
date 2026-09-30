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

## Checklist de ativação

1. Configurar `SANITY_API_WRITE_TOKEN` na Vercel para Production, Preview e Development.
2. Gerar um novo deployment depois da configuração da variável.
3. Validar login, dashboard e cadastro de um contato de teste.
4. Validar envio de teste para a própria BEZEL.
5. Validar um envio real controlado e confirmar histórico/limite diário.
6. Somente depois promover a V2 para produção.


## Busca de prospecção — Foursquare + Hunter

A aba de prospecção usa o Foursquare Places como fonte local principal para descobrir empresas por segmento e localidade. O Hunter.io entra depois para resolver domínios ausentes, enriquecer dados e localizar e-mails profissionais.

Variáveis adicionais na Vercel:

```
FOURSQUARE_API_KEY=<Service API Key privada do Foursquare>
HUNTER_API_KEY=<chave privada da API Hunter.io>
```

As duas chaves devem existir apenas no servidor, sem prefixo `NEXT_PUBLIC_`. A integração usa a Places API atual do Foursquare com autenticação Bearer e versão `2025-06-17`.

O fluxo consulta o Foursquare por atividade + cidade, deduplica empresas pelo domínio, valida a atividade antes do cadastro e usa o Hunter para e-mail/enriquecimento. Em administração condominial, o próprio site da empresa precisa comprovar a atividade; resultados apenas relacionados a condomínios são descartados.

O CRM prioriza e-mails genéricos/profissionais quando disponíveis. Telefone é armazenado como telefone; números internacionais incompatíveis com Brasil são descartados e o sistema não presume que um número seja WhatsApp. O campo WhatsApp permanece separado para confirmação explícita.

A origem do lead é preservada como `Foursquare + Hunter` ou `Hunter`. A deduplicação usa o domínio da empresa. Contatos sem e-mail também podem permanecer na base para revisão, mas não podem ser selecionados para disparo de e-mail.

Em `Contatos`, é possível filtrar por segmento, cidade, origem e presença de e-mail, arquivar, excluir definitivamente e selecionar em lote somente contatos aptos a receber e-mail.
