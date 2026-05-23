# Domínio: Communication

#### Message

| Label PO | Label Dev | Campo banco | Tipo SQL | Obrigatório | Notas |
|---|---|---|---|---|---|
| Contato | contactId | contact_id | uuid | sim | FK → contacts.id |
| Remetente | userId | user_id | uuid | sim | FK → users.id |
| Canal | channel | channel | enum | sim | email \| sms \| whatsapp |
| Status | status | status | enum | automático | pending \| sent \| delivered \| failed |
| Conteúdo | body | body | text | sim | |
| Assunto | subject | subject | varchar(255) | não | Apenas para canal email |
| Enviado em | sentAt | sent_at | timestamptz | não | Preenchido após confirmação de envio |
| Código de erro | errorCode | error_code | varchar(60) | não | Código retornado pelo serviço externo |

#### EmailTemplate

| Label PO | Label Dev | Campo banco | Tipo SQL | Obrigatório | Notas |
|---|---|---|---|---|---|
| Nome | name | name | varchar(120) | sim | Único por organização |
| Assunto | subject | subject | varchar(255) | sim | Suporta variáveis: {{nome}} |
| Corpo | body | body | text | sim | HTML; suporta variáveis |
| Variáveis disponíveis | variables | variables | jsonb | não | Lista de variáveis suportadas pelo template |
