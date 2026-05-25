# Data Model: Capture
> Fragmento do DATA-MODEL.md — cole apenas este arquivo nas sessões
> que envolvam o domínio Capture.

## Form

| Label PO | Label Dev | Campo banco | Tipo SQL | Obrigatório | Notas |
|---|---|---|---|---|---|
| Nome | name | name | varchar(120) | sim | |
| Slug | slug | slug | varchar(60) | sim | Único por organização; kebab-case |
| Campos do formulário | fields | fields | jsonb | sim | Configuração dos campos públicos |
| Responsável padrão | defaultOwnerId | default_owner_id | uuid | sim | FK → users.id |
| Ativo | active | active | boolean | automático | Default: false |

## FormSubmission

| Label PO | Label Dev | Campo banco | Tipo SQL | Obrigatório | Notas |
|---|---|---|---|---|---|
| Formulário | formId | form_id | uuid | sim | FK → forms.id |
| Dados enviados | data | data | jsonb | sim | Respostas do preenchimento |
| Contato gerado | contactId | contact_id | uuid | não | FK → contacts.id |
| Enviado em | submittedAt | submitted_at | timestamptz | automático | |
| IP de origem | ipAddress | ip_address | varchar(45) | não | IPv4 ou IPv6 |
