# Feature Set: Registry
> **Nível 2** — Domínio: Contacts

## Responsabilidade
Gerenciar o ciclo de vida completo de um contato dentro da organização:
criação manual, edição de dados e importação em massa. É o ponto de entrada
de todos os contatos no sistema, independente da origem.

**Não faz**: segmentação, envio de mensagens, criação de tarefas.
Essas ações partem do contato já existente e pertencem a outros Feature Sets ou domínios.

---

## Features

| Feature | Arquivo | Descrição |
|---|---|---|
| Create Contact | [create-contact.md](create-contact.md) | Criação manual de um contato pelo usuário autenticado |
| Edit Contact | [edit-contact.md](edit-contact.md) | Edição de dados de um contato existente |
| Import Contacts | [import-contacts.md](import-contacts.md) | Importação em massa via arquivo CSV |

---

## Fluxo principal

```
Usuário quer adicionar contatos
          │
          ├─→ [Create Contact] ── Cadastro manual, um por vez
          │         │
          │         ▼
          │   Contato criado com source = "manual"
          │         │
          └─→ [Import Contacts] ── Upload de arquivo CSV
                    │
                    ▼
              Validação linha a linha
                    │
              ┌─────┴──────────────────────┐
              │ Linha válida               │ Linha inválida
              ▼                            ▼
        Contato criado              Registrada no relatório
        source = "import"           de erros da importação
                    │
                    ▼
              Relatório final exibido
              (criados / ignorados / erros)

Contato existente
          │
          └─→ [Edit Contact] ── Alteração de qualquer campo editável
                    │
                    ▼
              Histórico de alteração
              registrado no AuditLog
```

---

## Dependências entre features

| Regra | Descrição |
|---|---|
| Edit depende de Create | Não é possível editar um contato que não existe. Edit nunca cria registros novos. |
| Import é independente | A importação não usa Create internamente — tem sua própria lógica de inserção em lote para performance. |
| Duplicatas compartilhadas | A regra de e-mail único por organização se aplica igualmente em Create e Import. Em Import, linhas duplicadas são puladas e registradas no relatório de erros. |
| Campos imutáveis pós-criação | `contactSource` e `organizationId` definidos na criação não podem ser alterados por Edit. |

---

## Telas

| Tela | Rota | Features atendidas |
|---|---|---|
| Listagem de contatos | `/contacts` | Ponto de entrada; botão "Novo contato" aciona modal de Create |
| Modal de criação rápida | (modal em `/contacts`) | Create Contact — campos essenciais |
| Página de criação completa | `/contacts/new` | Create Contact — todos os campos |
| Detalhe do contato | `/contacts/:id` | Edit Contact — formulário inline ou modal de edição |
| Importação | `/contacts/import` | Import Contacts — upload, mapeamento de colunas e relatório |

---

## Permissões por role

| Role | Create | Edit | Import |
|---|---|---|---|
| admin | Cria e atribui a qualquer usuário | Edita qualquer contato da organização | Importa e atribui a qualquer usuário |
| agent | Cria atribuindo apenas a si mesmo | Edita apenas contatos onde é o responsável | Importa atribuindo apenas a si mesmo |
| viewer | Sem acesso | Sem acesso | Sem acesso |

---

## Endpoints

| Método | Rota | Feature | Descrição |
|---|---|---|---|
| `GET` | `/api/v1/contacts` | — | Lista contatos com filtros e paginação |
| `POST` | `/api/v1/contacts` | Create Contact | Cria um contato |
| `GET` | `/api/v1/contacts/:id` | — | Retorna detalhe de um contato |
| `PATCH` | `/api/v1/contacts/:id` | Edit Contact | Atualiza campos de um contato |
| `DELETE` | `/api/v1/contacts/:id` | — | Soft delete de um contato |
| `POST` | `/api/v1/contacts/import` | Import Contacts | Inicia importação via CSV |
| `GET` | `/api/v1/contacts/import/:jobId` | Import Contacts | Consulta status e relatório da importação |

---

## Campos consolidados do Feature Set

Todos os campos manipulados pelas features deste Feature Set.

| Label PO | Label Dev | Campo banco | Tipo | Feature(s) |
|---|---|---|---|---|
| Nome completo | fullName | full_name | varchar(120) | Create, Edit, Import |
| E-mail | email | email | varchar(254) | Create, Edit, Import |
| Telefone | phone | phone | varchar(20) | Create, Edit, Import |
| Responsável | ownerId | owner_id | uuid (FK) | Create, Edit, Import |
| Tags | tags | tags | text[] | Create, Edit, Import |
| Anotações | notes | notes | text | Create, Edit |
| Origem | contactSource | source | enum | Create (automático), Import (automático) |
| Organização | organizationId | organization_id | uuid (FK) | Create (automático) |
| Data de criação | createdAt | created_at | timestamptz | Create (automático) |
| Data de atualização | updatedAt | updated_at | timestamptz | Edit (automático) |
| Data de exclusão | deletedAt | deleted_at | timestamptz | Soft delete |

---

## Códigos de erro do Feature Set

| Código | HTTP | Feature | Situação |
|---|---|---|---|
| `CONTACT_NOT_FOUND` | 404 | Edit | Contato não existe ou foi excluído |
| `CONTACT_DUPLICATE_EMAIL` | 409 | Create, Import | E-mail já cadastrado na organização |
| `CONTACT_MISSING_CONTACT_INFO` | 422 | Create, Import | E-mail e telefone ambos ausentes |
| `CONTACT_OWNER_INACTIVE` | 422 | Create, Edit, Import | Responsável selecionado está desativado |
| `CONTACT_AGENT_OWNER_MISMATCH` | 422 | Create, Import | Agent tentou atribuir a outro usuário |
| `CONTACT_FIELD_IMMUTABLE` | 422 | Edit | Tentativa de alterar campo imutável |
| `IMPORT_INVALID_FILE` | 422 | Import | Arquivo não é um CSV válido |
| `IMPORT_FILE_TOO_LARGE` | 422 | Import | Arquivo excede o tamanho máximo permitido |
| `IMPORT_JOB_NOT_FOUND` | 404 | Import | Job de importação não encontrado |

---

## Eventos publicados e consumidos

| Evento | Tipo | Feature | Consumidores |
|---|---|---|---|
| `contact.created` | Publicado | Create, Import | Work/Notifications |
| `contact.updated` | Publicado | Edit | — |
| `contact.owner_changed` | Publicado | Edit | Work/Notifications |

---

*Domínio: Contacts · Última revisão: —*
