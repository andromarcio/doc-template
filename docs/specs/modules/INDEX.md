# Índice geral do sistema
> CRM — Visão consolidada de todos os domínios
> Gerado automaticamente pelo PROMPT 1 — não editar manualmente.
> Atualize via prompt sempre que um N1 for criado ou alterado.

---

## Domínios do sistema

| Domínio | Pasta | Responsabilidade | Feature Sets |
|---|---|---|---|
| [Identity](#identity) | `modules/identity/` | Autenticação, usuários e controle de acesso | 2 |
| [Contacts](#contacts) | `modules/contacts/` | Cadastro, segmentação e histórico de contatos | 2 |
| [Communication](#communication) | `modules/communication/` | Envio de mensagens por e-mail, SMS e WhatsApp | 3 |
| [Work](#work) | `modules/work/` | Tarefas internas do time e notificações | 2 |
| [Capture](#capture) | `modules/capture/` | Captação de leads via formulários públicos | 2 |

---

## Identity

**Responsabilidade**: gerenciar quem acessa o sistema e o que cada perfil pode fazer.
**Não faz**: relatórios de uso, preferências de UI, templates de e-mail marketing.

📄 [README.md completo](modules/identity/README.md)

### Feature Sets

| Feature Set | Pasta | Responsabilidade | Features |
|---|---|---|---|
| [User Management](modules/identity/user-management/README.md) | `identity/user-management/` | Cadastro, login, perfil e sessão | 6 |
| [Access Control](modules/identity/access-control/README.md) | `identity/access-control/` | Roles, permissões e auditoria | 2 |

### Features

| Feature | Arquivo | Feature Set |
|---|---|---|
| Register User | [register-user.md](modules/identity/user-management/register-user.md) | User Management |
| Google OAuth | [google-oauth.md](modules/identity/user-management/google-oauth.md) | User Management |
| Login | [login.md](modules/identity/user-management/login.md) | User Management |
| Forgot Password | [forgot-password.md](modules/identity/user-management/forgot-password.md) | User Management |
| Profile Settings | [profile-settings.md](modules/identity/user-management/profile-settings.md) | User Management |
| Logout | [logout.md](modules/identity/user-management/logout.md) | User Management |
| Roles & Permissions | [roles-permissions.md](modules/identity/access-control/roles-permissions.md) | Access Control |
| Audit Log | [audit-log.md](modules/identity/access-control/audit-log.md) | Access Control |

### Entidades

| Entidade | Campos principais | Usada por |
|---|---|---|
| User | id, organizationId, name, email, role, provider, avatarUrl, lastLoginAt, deletedAt | Todos os domínios |
| Organization | id, name, slug, defaultOwnerId | Todos os domínios |
| AuditLog | id, organizationId, userId, action, targetEntity, targetId, metadata | Identity, operações críticas |

---

## Contacts

**Responsabilidade**: centralizar todos os contatos (leads, clientes, prospects), permitindo cadastro, busca, segmentação e histórico de interações.
**Não faz**: envio de mensagens, criação de tarefas (apenas vincula), relatórios analíticos.

📄 [README.md completo](modules/contacts/README.md)

### Feature Sets

| Feature Set | Pasta | Responsabilidade | Features |
|---|---|---|---|
| [Registry](modules/contacts/registry/README.md) | `contacts/registry/` | CRUD completo de contatos e importação | 3 |
| [Segmentation](modules/contacts/segmentation/README.md) | `contacts/segmentation/` | Tags, filtros e listas segmentadas | 2 |

### Features

| Feature | Arquivo | Feature Set |
|---|---|---|
| Create Contact | [create-contact.md](modules/contacts/registry/create-contact.md) | Registry |
| Edit Contact | [edit-contact.md](modules/contacts/registry/edit-contact.md) | Registry |
| Import Contacts | [import-contacts.md](modules/contacts/registry/import-contacts.md) | Registry |
| Tags | [tags.md](modules/contacts/segmentation/tags.md) | Segmentation |
| Smart Lists | [smart-lists.md](modules/contacts/segmentation/smart-lists.md) | Segmentation |

### Entidades

| Entidade | Campos principais | Usada por |
|---|---|---|
| Contact | id, organizationId, name, email, phone, ownerId, source, tags, notes, deletedAt | Contacts, Communication, Work, Capture |
| Tag | id, organizationId, name, color | Contacts |
| SmartList | id, organizationId, name, filters (jsonb) | Contacts |

---

## Communication

**Responsabilidade**: enviar e registrar mensagens para contatos por e-mail, SMS e WhatsApp, com suporte a templates.
**Não faz**: cadastro de contatos, criação de tarefas, formulários públicos.

📄 [README.md completo](modules/communication/README.md)

### Feature Sets

| Feature Set | Pasta | Responsabilidade | Features |
|---|---|---|---|
| [Email](modules/communication/email/README.md) | `communication/email/` | Envio de e-mails e gestão de templates | 2 |
| [SMS](modules/communication/sms/README.md) | `communication/sms/` | Envio de SMS e histórico | 1 |
| [WhatsApp](modules/communication/whatsapp/README.md) | `communication/whatsapp/` | Envio de mensagens e histórico de conversas | 2 |

### Features

| Feature | Arquivo | Feature Set |
|---|---|---|
| Send Email | [send-email.md](modules/communication/email/send-email.md) | Email |
| Email Templates | [email-templates.md](modules/communication/email/email-templates.md) | Email |
| Send SMS | [send-sms.md](modules/communication/sms/send-sms.md) | SMS |
| Send WhatsApp Message | [send-message.md](modules/communication/whatsapp/send-message.md) | WhatsApp |
| Conversation History | [conversation-history.md](modules/communication/whatsapp/conversation-history.md) | WhatsApp |

### Entidades

| Entidade | Campos principais | Usada por |
|---|---|---|
| Message | id, organizationId, contactId, userId, channel, status, body, sentAt, errorCode | Communication |
| EmailTemplate | id, organizationId, name, subject, body, variables (jsonb) | Communication |
| WhatsAppConversation | id, organizationId, contactId, status, lastMessageAt | Communication |

### Dependências externas

| Serviço | Feature Set | Uso |
|---|---|---|
| SendGrid | Email | Envio e rastreamento de e-mails |
| Twilio | SMS | Envio de SMS |
| Evolution API | WhatsApp | Envio de mensagens WhatsApp |

---

## Work

**Responsabilidade**: gerenciar tarefas internas do time vinculadas a contatos, com atribuição, prazos e notificações.
**Não faz**: envio de mensagens externas, relatórios de performance, gestão de projetos complexos.

📄 [README.md completo](modules/work/README.md)

### Feature Sets

| Feature Set | Pasta | Responsabilidade | Features |
|---|---|---|---|
| [Tasks](modules/work/tasks/README.md) | `work/tasks/` | Criação, atribuição e acompanhamento de tarefas | 3 |
| [Notifications](modules/work/notifications/README.md) | `work/notifications/` | Lembretes e alertas internos | 2 |

### Features

| Feature | Arquivo | Feature Set |
|---|---|---|
| Create Task | [create-task.md](modules/work/tasks/create-task.md) | Tasks |
| Task Board | [task-board.md](modules/work/tasks/task-board.md) | Tasks |
| Assign Task | [assign-task.md](modules/work/tasks/assign-task.md) | Tasks |
| Reminders | [reminders.md](modules/work/notifications/reminders.md) | Notifications |
| Push Notifications | [push-notifications.md](modules/work/notifications/push-notifications.md) | Notifications |

### Entidades

| Entidade | Campos principais | Usada por |
|---|---|---|
| Task | id, organizationId, contactId, assignedTo, createdBy, title, description, dueDate, status, priority | Work |
| Notification | id, organizationId, userId, type, title, body, readAt, relatedEntity, relatedId | Work |

---

## Capture

**Responsabilidade**: criar formulários públicos para captação de leads sem necessidade de autenticação, convertendo submissões em contatos.
**Não faz**: cadastro de contatos internos, envio de mensagens, gestão de campanhas.

📄 [README.md completo](modules/capture/README.md)

### Feature Sets

| Feature Set | Pasta | Responsabilidade | Features |
|---|---|---|---|
| [Forms](modules/capture/forms/README.md) | `capture/forms/` | Criação e gestão de formulários | 2 |
| [Public](modules/capture/public/README.md) | `capture/public/` | Página pública e submissão sem autenticação | 2 |

### Features

| Feature | Arquivo | Feature Set |
|---|---|---|
| Form Editor | [form-editor.md](modules/capture/forms/form-editor.md) | Forms |
| Form Submissions | [form-submissions.md](modules/capture/forms/form-submissions.md) | Forms |
| Embed Form | [embed-form.md](modules/capture/public/embed-form.md) | Public |
| Public Slug | [public-slug.md](modules/capture/public/public-slug.md) | Public |

### Entidades

| Entidade | Campos principais | Usada por |
|---|---|---|
| Form | id, organizationId, name, slug, fields (jsonb), defaultOwnerId, active | Capture |
| FormSubmission | id, formId, organizationId, data (jsonb), contactId, submittedAt, ipAddress | Capture |

---

## Entidades consolidadas do sistema

Todas as entidades de todos os domínios, para referência cruzada rápida.

| Entidade | Domínio | Arquivo de origem |
|---|---|---|
| AuditLog | Identity | [README.md](modules/identity/README.md) |
| Contact | Contacts | [README.md](modules/contacts/README.md) |
| EmailTemplate | Communication | [README.md](modules/communication/README.md) |
| Form | Capture | [README.md](modules/capture/README.md) |
| FormSubmission | Capture | [README.md](modules/capture/README.md) |
| Message | Communication | [README.md](modules/communication/README.md) |
| Notification | Work | [README.md](modules/work/README.md) |
| Organization | Identity | [README.md](modules/identity/README.md) |
| SmartList | Contacts | [README.md](modules/contacts/README.md) |
| Tag | Contacts | [README.md](modules/contacts/README.md) |
| Task | Work | [README.md](modules/work/README.md) |
| User | Identity | [README.md](modules/identity/README.md) |
| WhatsAppConversation | Communication | [README.md](modules/communication/README.md) |

---

## Mapa de integrações entre domínios

Quem depende de quem e de que forma.

| Domínio origem | Depende de | Tipo | Descrição |
|---|---|---|---|
| Contacts | Identity | Leitura | `ownerId` referencia `User`; `organizationId` referencia `Organization` |
| Communication | Identity | Leitura | `userId` (remetente) referencia `User` |
| Communication | Contacts | Leitura | `contactId` referencia `Contact` |
| Work | Identity | Leitura | `assignedTo`, `createdBy` referenciam `User` |
| Work | Contacts | Leitura | `contactId` referencia `Contact` |
| Capture | Identity | Leitura | `defaultOwnerId` referencia `User`; `organizationId` referencia `Organization` |
| Capture | Contacts | Escrita | Submissão de formulário cria ou atualiza `Contact` |
| Capture | Work | Evento | Submissão publica evento `contact.created` consumido por Work (notificação ao responsável) |
| Communication | Work | Evento | Falha de envio publica evento `message.failed` consumido por Work (notificação ao agente) |

---

## Eventos internos do sistema

Todos os eventos publicados e consumidos entre domínios.

| Evento | Publicado por | Consumido por | Payload principal |
|---|---|---|---|
| `contact.created` | Capture | Work | organizationId, contactId, source, formId |
| `contact.owner_changed` | Contacts | Work | organizationId, contactId, oldOwnerId, newOwnerId |
| `message.sent` | Communication | Contacts | organizationId, contactId, channel, messageId |
| `message.failed` | Communication | Work | organizationId, contactId, channel, messageId, errorCode |
| `task.assigned` | Work | Work (Notifications) | organizationId, taskId, assignedTo, assignedBy |
| `task.due_soon` | Work (scheduler) | Work (Notifications) | organizationId, taskId, assignedTo, dueDate |
| `user.created` | Identity | — | organizationId, userId, provider |
| `user.disabled` | Identity | — | organizationId, userId |

---

*Última atualização: —*
*Para atualizar este índice, execute o PASSO 3 do PROMPT 1 com os N1 vigentes.*
