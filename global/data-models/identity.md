# Domínio: Identity

#### Organization

| Label PO | Label Dev | Campo banco | Tipo SQL | Obrigatório | Notas |
|---|---|---|---|---|---|
| Nome | name | name | varchar(120) | sim | Nome da empresa ou organização |
| Slug | slug | slug | varchar(60) | sim | Único global; kebab-case; usado em URLs |
| Responsável padrão | defaultOwnerId | default_owner_id | uuid | sim | FK → users.id; usado quando não há responsável definido |

#### User

| Label PO | Label Dev | Campo banco | Tipo SQL | Obrigatório | Notas |
|---|---|---|---|---|---|
| Nome completo | fullName | full_name | varchar(120) | sim | 2 a 120 caracteres |
| E-mail | email | email | varchar(254) | sim | Único por organização; formato válido |
| URL do avatar | avatarUrl | avatar_url | text | não | URL pública; atualizada a cada login via Google |
| Nível de acesso | role | role | enum | sim | admin \| agent \| viewer |
| Provedor de autenticação | provider | provider | enum | sim | local \| google |
| Último acesso | lastLoginAt | last_login_at | timestamptz | não | Atualizado a cada login bem-sucedido |

#### AuditLog

| Label PO | Label Dev | Campo banco | Tipo SQL | Obrigatório | Notas |
|---|---|---|---|---|---|
| Usuário | userId | user_id | uuid | sim | FK → users.id; quem executou a ação |
| Ação | action | action | varchar(60) | sim | Ex: contact.created, user.role_changed |
| Entidade afetada | targetEntity | target_entity | varchar(60) | sim | Ex: Contact, User |
| ID do registro afetado | targetId | target_id | uuid | sim | ID do registro que sofreu a ação |
| Dados adicionais | metadata | metadata | jsonb | não | Dados antes/depois, contexto da ação |
