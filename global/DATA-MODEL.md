# DATA-MODEL.md
> **Fonte única de verdade** para nomenclatura e mapeamento de campos.
> Toda nova feature que introduzir campos novos deve atualizá-lo
> antes da implementação — nunca depois.
>
> Os N3 referenciam este arquivo para nomenclatura técnica:
> `→ ver DATA-MODEL.md: Entidade [Nome]`
> Os N3 nunca duplicam Label Dev ou campo banco em suas próprias tabelas.

---

## Convenção de nomenclatura

| Camada | Convenção | Exemplo | Onde aparece |
|---|---|---|---|
| Label PO | Português, title case, sem jargão | `Nome completo` | N3 (tabela de campos), Gherkin, telas |
| Label Dev | camelCase, inglês, autoexplicativo | `fullName` | N3 (API, AuditLog, pseudocódigo), código |
| Campo banco | [CONVENÇÃO DA ORGANIZAÇÃO] | `full_name` | Migrations, schema Prisma, queries |

> ⚠️ Informe aqui a convenção de nomenclatura de banco de dados
> utilizada pela sua organização.
> Exemplos: snake_case, camelCase, PascalCase, prefixo por módulo.

---

## Campos globais (presentes em todas as tabelas)

Estes campos existem em toda entidade do sistema.
Não precisam ser listados nas tabelas de entidade abaixo —
estão implícitos.

| Label PO | Label Dev | Campo banco | Tipo SQL | Notas |
|---|---|---|---|---|
| Identificador | id | id | uuid | PK; gerado automaticamente |
| Organização | organizationId | organization_id | uuid | FK → organizations; multitenancy obrigatório |
| Data de criação | createdAt | created_at | timestamptz | Gerado automaticamente pelo banco |
| Data de atualização | updatedAt | updated_at | timestamptz | Atualizado automaticamente |
| Data de exclusão | deletedAt | deleted_at | timestamptz | Null = ativo; soft delete |

---

## Entidades por domínio

<!--
  Para cada domínio, liste suas entidades.
  Para cada entidade, liste todos os campos além dos globais.

  Ao gerar um N3, o PROMPT 3B cruza os campos informados
  com esta tabela antes de propor qualquer nomenclatura.

  Campos novos aprovados durante uma sessão são adicionados
  aqui ANTES de começar a implementação.
-->

---

### Domínio: Identity

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

---

### Domínio: Contacts

#### Contact

| Label PO | Label Dev | Campo banco | Tipo SQL | Obrigatório | Notas |
|---|---|---|---|---|---|
| Nome completo | fullName | full_name | varchar(120) | sim | 2 a 120 caracteres |
| E-mail | email | email | varchar(254) | não* | Único por organização; *ver Regra 2 do N1 |
| Telefone | phone | phone | varchar(20) | não* | Formato E.164; *ver Regra 2 do N1 |
| Responsável | ownerId | owner_id | uuid | sim | FK → users.id; deve ser usuário ativo |
| Origem | contactSource | source | enum | automático | manual \| form \| import \| api |
| Tags | tags | tags | text[] | não | Máximo 20; cada tag até 30 caracteres |
| Anotações | notes | notes | text | não | Máximo 5.000 caracteres |

#### Tag

| Label PO | Label Dev | Campo banco | Tipo SQL | Obrigatório | Notas |
|---|---|---|---|---|---|
| Nome | name | name | varchar(30) | sim | Único por organização; case-insensitive |
| Cor | color | color | varchar(7) | não | Código hex; ex: #FF5733 |

#### SmartList

| Label PO | Label Dev | Campo banco | Tipo SQL | Obrigatório | Notas |
|---|---|---|---|---|---|
| Nome da lista | listName | name | varchar(120) | sim | Único por organização |
| Critérios | filters | filters | jsonb | sim | → ver segmentation/smart-lists.md: estrutura do jsonb |
| Criado por | createdBy | created_by | uuid | automático | FK → users.id |

#### ImportJob

| Label PO | Label Dev | Campo banco | Tipo SQL | Obrigatório | Notas |
|---|---|---|---|---|---|
| Status | status | status | enum | automático | pending \| processing \| done \| failed |
| Total de linhas | totalRows | total_rows | integer | automático | Total do CSV excluindo header |
| Importados | importedCount | imported_count | integer | automático | Linhas inseridas com sucesso |
| Ignorados | skippedCount | skipped_count | integer | automático | Duplicatas ignoradas |
| Erros | errorCount | error_count | integer | automático | Linhas com erro de validação |
| Chave do arquivo | fileKey | file_key | varchar | sim | Referência no storage temporário |
| Mapeamento de colunas | columnMapping | column_mapping | jsonb | sim | Colunas CSV → campos do sistema |
| Responsável padrão | defaultOwnerId | default_owner_id | uuid | sim | FK → users.id |
| Ignorar cabeçalho | skipHeader | skip_header | boolean | sim | Default: true |
| Relatório de erros | errorReport | error_report | jsonb | não | Array de { row, originalData, errors[] } |
| Criado por | createdBy | created_by | uuid | automático | FK → users.id |

---

### Domínio: Communication

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

---

### Domínio: Work

#### Task

| Label PO | Label Dev | Campo banco | Tipo SQL | Obrigatório | Notas |
|---|---|---|---|---|---|
| Título | title | title | varchar(255) | sim | |
| Descrição | description | description | text | não | |
| Contato vinculado | contactId | contact_id | uuid | não | FK → contacts.id |
| Atribuído a | assignedTo | assigned_to | uuid | sim | FK → users.id |
| Criado por | createdBy | created_by | uuid | automático | FK → users.id |
| Prazo | dueDate | due_date | timestamptz | não | |
| Status | status | status | enum | automático | open \| in_progress \| done \| cancelled |
| Prioridade | priority | priority | enum | sim | low \| medium \| high |

#### Notification

| Label PO | Label Dev | Campo banco | Tipo SQL | Obrigatório | Notas |
|---|---|---|---|---|---|
| Destinatário | userId | user_id | uuid | sim | FK → users.id |
| Tipo | type | type | enum | sim | task_assigned \| import_completed \| message_failed... |
| Título | title | title | varchar(120) | sim | |
| Corpo | body | body | text | sim | |
| Lida em | readAt | read_at | timestamptz | não | Null = não lida |
| Entidade relacionada | relatedEntity | related_entity | varchar(60) | não | Ex: Task, Contact |
| ID da entidade relacionada | relatedId | related_id | uuid | não | ID do registro relacionado |

---

### Domínio: Capture

#### Form

| Label PO | Label Dev | Campo banco | Tipo SQL | Obrigatório | Notas |
|---|---|---|---|---|---|
| Nome | name | name | varchar(120) | sim | |
| Slug | slug | slug | varchar(60) | sim | Único por organização; kebab-case |
| Campos do formulário | fields | fields | jsonb | sim | Configuração dos campos exibidos publicamente |
| Responsável padrão | defaultOwnerId | default_owner_id | uuid | sim | FK → users.id; atribuído a novos contatos |
| Ativo | active | active | boolean | automático | Default: false; true = visível publicamente |

#### FormSubmission

| Label PO | Label Dev | Campo banco | Tipo SQL | Obrigatório | Notas |
|---|---|---|---|---|---|
| Formulário | formId | form_id | uuid | sim | FK → forms.id |
| Dados enviados | data | data | jsonb | sim | Respostas do preenchimento público |
| Contato gerado | contactId | contact_id | uuid | não | FK → contacts.id; preenchido após conversão |
| Enviado em | submittedAt | submitted_at | timestamptz | automático | |
| IP de origem | ipAddress | ip_address | varchar(45) | não | IPv4 ou IPv6 |

---

## Enums do sistema

| Enum | Campo banco | Valores | Usado em |
|---|---|---|---|
| Role | role | admin, agent, viewer | User.role |
| Provider | provider | local, google | User.provider |
| ContactSource | source | manual, form, import, api | Contact.source |
| MessageChannel | channel | email, sms, whatsapp | Message.channel |
| MessageStatus | status | pending, sent, delivered, failed | Message.status |
| TaskStatus | status | open, in_progress, done, cancelled | Task.status |
| TaskPriority | priority | low, medium, high | Task.priority |
| ImportJobStatus | status | pending, processing, done, failed | ImportJob.status |

---

## Campos adicionados recentemente

<!--
  Registre aqui campos novos aprovados durante sessões de N3
  antes de atualizar as tabelas acima.
  Facilita a criação das migrations e o rastreamento de mudanças.
-->

| Data | Entidade | Label PO | Label Dev | Campo banco | Tipo | N3 de origem |
|---|---|---|---|---|---|---|
| [data] | [entidade] | [label PO] | [camelCase] | [snake_case] | [tipo] | [link para o N3] |

---

## Relacionamentos

```
Organization 1──N User
Organization 1──N Contact
Organization 1──N Tag
Organization 1──N SmartList
Organization 1──N Form
Organization 1──N ImportJob

User (owner) 1──N Contact
User (assigned) 1──N Task
User 1──N Message (remetente)
User 1──N Notification

Contact N──N Tag (via Contact.tags[])
Contact 1──N Message
Contact 1──N Task
Contact 1──N FormSubmission

Form 1──N FormSubmission
ImportJob 1──N Contact (criados pela importação)
```

---

## Índices e restrições de unicidade

| Tabela | Campos | Tipo | Justificativa |
|---|---|---|---|
| users | (organization_id, email) | UNIQUE | E-mail único por organização |
| contacts | (organization_id, email) | UNIQUE (partial: email IS NOT NULL) | E-mail único por organização |
| tags | (organization_id, name) | UNIQUE | Tag única por organização (case-insensitive) |
| smart_lists | (organization_id, name) | UNIQUE | Nome de lista único por organização |
| forms | (organization_id, slug) | UNIQUE | Slug único por organização |
| organizations | (slug) | UNIQUE | Slug único global |
| contacts | (organization_id) | INDEX | Listagens frequentes por organização |
| tasks | (organization_id, assigned_to) | INDEX | Filtro de tarefas por responsável |
| messages | (organization_id, contact_id) | INDEX | Histórico de mensagens por contato |
