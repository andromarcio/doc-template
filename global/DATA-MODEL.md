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

Os modelos de dados detalhados estão fragmentados por domínio para facilitar o gerenciamento de contexto do LLM.

- [Identity](data-models/identity.md)
- [Contacts](data-models/contacts.md)
- [Communication](data-models/communication.md)
- [Work](data-models/work.md)
- [Capture](data-models/capture.md)

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
