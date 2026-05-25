# Data Model: Communication
> Fragmento do DATA-MODEL.md — cole apenas este arquivo nas sessões
> que envolvam o domínio Communication.

## Message

| Label PO | Label Dev | Campo banco | Tipo SQL | Obrigatório | Notas |
|---|---|---|---|---|---|
| Contato | contactId | contact_id | uuid | sim | FK → contacts.id |
| Remetente | userId | user_id | uuid | sim | FK → users.id |
| Canal | channel | channel | enum | sim | email \| sms \| whatsapp |
| Status | status | status | enum | automático | pending \| sent \| delivered \| failed |
| Conteúdo | body | body | text | sim | |
| Assunto | subject | subject | varchar(255) | não | Apenas canal email |
| Enviado em | sentAt | sent_at | timestamptz | não | Preenchido após confirmação |
| Código de erro | errorCode | error_code | varchar(60) | não | Retornado pelo serviço externo |

## EmailTemplate

| Label PO | Label Dev | Campo banco | Tipo SQL | Obrigatório | Notas |
|---|---|---|---|---|---|
| Nome | name | name | varchar(120) | sim | Único por organização |
| Assunto | subject | subject | varchar(255) | sim | Suporta variáveis: {{nome}} |
| Corpo | body | body | text | sim | HTML com variáveis |
| Variáveis disponíveis | variables | variables | jsonb | não | Lista de variáveis suportadas |

## WhatsAppConversation

| Label PO | Label Dev | Campo banco | Tipo SQL | Obrigatório | Notas |
|---|---|---|---|---|---|
| Contato | contactId | contact_id | uuid | sim | FK → contacts.id |
| Status | status | status | enum | automático | open \| closed |
| Última mensagem | lastMessageAt | last_message_at | timestamptz | não | |
