# Domínio: Work

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
