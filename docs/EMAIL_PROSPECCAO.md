# Painel de prospecção por e-mail

Rota privada de operação: `/email`.

## Objetivo

Permitir à BEZEL enviar pequenos lotes de prospecção B2B usando o SMTP já configurado no site, sem expor credenciais no navegador.

## Segurança

O endpoint `POST /api/email-prospeccao` exige a variável de ambiente:

```
EMAIL_PANEL_PASSWORD=<senha forte e exclusiva>
```

A senha não deve ser commitada no Git. Configure-a no ambiente da Vercel.

As credenciais SMTP existentes continuam sendo lidas apenas no servidor:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASSWORD`

## Uso

Cada linha de destinatário pode ser:

```
ITJ | contato@itj.g12.br
Colégio Exemplo <contato@exemplo.com.br>
contato@outraescola.com.br
```

O marcador `{{nome}}` no assunto ou mensagem é substituído pelo nome cadastrado.

## Limites desta primeira versão

- máximo de 20 destinatários por operação;
- envio individual: nenhum destinatário vê os demais;
- não há banco/CRM nem histórico persistente nesta versão;
- não há agendamento;
- não há rastreamento de abertura;
- não há anexo;
- o painel inclui opção de teste antes do envio real.

Para histórico persistente, follow-up, listas e supressão permanente, evoluir para armazenamento dedicado antes de ampliar volume.
