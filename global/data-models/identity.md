# Data Model: Identity
> Fragmento do DATA-MODEL.md — cole apenas este arquivo nas sessões
> que envolvam o domínio Identity.

## Organization

| Label PO | Label Dev | Campo banco | Tipo SQL | Obrigatório | Notas |
|---|---|---|---|---|---|
| Nome | name | name | varchar(120) | sim | Nome da empresa ou organização |
| Slug | slug | slug | varchar(60) | sim | Único global; kebab-case; usado em URLs |
| Responsável padrão | defaultOwnerId | default_owner_id | uuid | sim | FK → users.id |

## User

| Label PO | Label Dev | Campo banco | Tipo SQL | Obrigatório | Notas |
|---|---|---|---|---|---|
| Nome completo | fullName | full_name | varchar(120) | sim | 2 a 120 caracteres |
| E-mail | email | email | varchar(254) | sim | Único por organização |
| URL do avatar | avatarUrl | avatar_url | text | não | Atualizada a cada login via Google |
| Nível de acesso | role | role | enum | sim | admin \| agent \| viewer |
| Provedor de autenticação | provider | provider | enum | sim | local \| google |
| Último acesso | lastLoginAt | last_login_at | timestamptz | não | Atualizado a cada login |

## AuditLog

| Label PO | Label Dev | Campo banco | Tipo SQL | Obrigatório | Notas |
|---|---|---|---|---|---|
| Usuário | userId | user_id | uuid | sim | FK → users.id |
| Ação | action | action | varchar(60) | sim | Ex: contact.created |
| Entidade afetada | targetEntity | target_entity | varchar(60) | sim | Ex: Contact, User |
| ID do registro | targetId | target_id | uuid | sim | ID do registro afetado |
| Dados adicionais | metadata | metadata | jsonb | não | Contexto da ação |
