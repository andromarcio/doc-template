# Domínio: Contacts
> **Nível 1** — Visão estratégica do domínio

## Responsabilidade
Centralizar todos os contatos da organização — leads, clientes e prospects —
permitindo seu cadastro, manutenção, segmentação e consulta de histórico de
interações. É o domínio de referência para qualquer ação que envolva uma
pessoa externa à organização.

### O que este domínio NÃO faz
| Responsabilidade | Pertence a |
|---|---|
| Enviar mensagens (e-mail, SMS, WhatsApp) | Communication |
| Criar ou gerenciar tarefas | Work |
| Captar contatos via formulário público | Capture |
| Controlar quem acessa o sistema | Identity |
| Gerar relatórios analíticos de desempenho | Analytics (futuro) |

---

## Feature Sets

| Feature Set | Pasta | Responsabilidade | Features |
|---|---|---|---|
| [Registry](registry/README.md) | `contacts/registry/` | Criação, edição e importação de contatos | 3 |
| [Segmentation](segmentation/README.md) | `contacts/segmentation/` | Tags e listas dinâmicas para segmentação | 2 |

---

## Entidades do domínio

### Contact
Entidade central do domínio. Todo contato pertence a uma organização
e tem exatamente um usuário responsável.

| Label PO | Label Dev | Campo banco | Tipo | Obrigatório | Notas |
|---|---|---|---|---|---|
| Identificador | id | id | uuid | automático | PK; gerado pelo banco |
| Organização | organizationId | organization_id | uuid | automático | FK → organizations.id; do contexto da sessão |
| Nome completo | fullName | full_name | varchar(120) | sim | 2 a 120 caracteres |
| E-mail | email | email | varchar(254) | não* | Único por organização; formato válido |
| Telefone | phone | phone | varchar(20) | não* | Formato E.164 (+5511999999999) |
| Responsável | ownerId | owner_id | uuid | sim | FK → users.id; deve ser usuário ativo |
| Origem | contactSource | source | enum | automático | manual \| form \| import \| api |
| Tags | tags | tags | text[] | não | Máximo 20; cada tag até 30 caracteres |
| Anotações | notes | notes | text | não | Máximo 5.000 caracteres |
| Data de criação | createdAt | created_at | timestamptz | automático | Gerado pelo banco |
| Data de atualização | updatedAt | updated_at | timestamptz | automático | Atualizado automaticamente |
| Data de exclusão | deletedAt | deleted_at | timestamptz | não | Null = ativo; soft delete |

*E-mail e telefone não podem ser ambos vazios simultaneamente.

### Tag
Representa uma classificação livre aplicável a contatos.
Tags são criadas implicitamente ao serem digitadas — não há cadastro prévio.

| Label PO | Label Dev | Campo banco | Tipo | Obrigatório | Notas |
|---|---|---|---|---|---|
| Identificador | id | id | uuid | automático | PK |
| Organização | organizationId | organization_id | uuid | automático | FK → organizations.id |
| Nome | name | name | varchar(30) | sim | Único por organização; case-insensitive |
| Cor | color | color | varchar(7) | não | Código hex; ex: #FF5733 |
| Data de criação | createdAt | created_at | timestamptz | automático | |

### SmartList
Lista dinâmica de contatos definida por um conjunto de critérios salvos.
O resultado é sempre calculado no momento da consulta — não é persistido.

| Label PO | Label Dev | Campo banco | Tipo | Obrigatório | Notas |
|---|---|---|---|---|---|
| Identificador | id | id | uuid | automático | PK |
| Organização | organizationId | organization_id | uuid | automático | FK → organizations.id |
| Nome da lista | listName | name | varchar(120) | sim | Único por organização |
| Critérios | filters | filters | jsonb | sim | Estrutura definida em segmentation/smart-lists.md |
| Criado por | createdBy | created_by | uuid | automático | FK → users.id |
| Data de criação | createdAt | created_at | timestamptz | automático | |
| Data de atualização | updatedAt | updated_at | timestamptz | automático | |

---

## Regras transversais do domínio

1. **Isolamento por organização**: toda query obrigatoriamente filtra por
   `organization_id`. Um contato de uma organização nunca é visível em outra.

2. **Soft delete universal**: contatos excluídos têm `deleted_at` preenchido.
   Nunca são removidos fisicamente do banco. Não aparecem em nenhuma listagem,
   busca ou Smart List. Seus vínculos com tarefas e mensagens são preservados.

3. **E-mail único por organização**: dois contatos da mesma organização não podem
   ter o mesmo e-mail. A unicidade não se aplica entre organizações diferentes.

4. **Ao menos um meio de contato**: todo contato deve ter e-mail ou telefone
   preenchido. Ambos vazios são recusados em qualquer operação de criação ou edição.

5. **Responsável sempre ativo**: o campo `ownerId` deve sempre referenciar um
   usuário com `deleted_at` nulo. Ao desativar um usuário no domínio Identity,
   todos os seus contatos devem ser reatribuídos antes ou ter um responsável
   padrão da organização atribuído automaticamente.

6. **Origem imutável**: o campo `source` é definido na criação e nunca pode
   ser alterado. Reflete como o contato entrou no sistema.

7. **Rastreabilidade obrigatória**: as operações de criação, edição de responsável
   e exclusão são sempre registradas no `AuditLog` do domínio Identity.

---

## Dependências externas

Este domínio não depende de nenhum serviço externo diretamente.
A importação de CSV é processada internamente pelo próprio domínio.

---

## Integrações com outros domínios

### Leitura — domínios que consomem dados de Contacts

| Domínio | O que consome | Como |
|---|---|---|
| Communication | `Contact` (id, name, email, phone) | FK `contact_id` em `Message` |
| Work | `Contact` (id, name) | FK `contact_id` em `Task` |
| Capture | `Contact` (id, email, phone) | Verifica duplicata antes de criar via formulário |

### Escrita — domínios que criam ou alteram dados de Contacts

| Domínio | O que altera | Situação |
|---|---|---|
| Capture | Cria `Contact` | Submissão de formulário público converte em contato |
| Identity | Reatribui `ownerId` | Desativação de usuário dispara reatribuição em lote |

### Eventos publicados por este domínio

| Evento | Situação | Consumidores |
|---|---|---|
| `contact.created` | Novo contato criado (qualquer origem) | Work/Notifications |
| `contact.updated` | Dados do contato alterados | — |
| `contact.owner_changed` | Responsável alterado | Work/Notifications |
| `contact.tagged` | Tag adicionada ao contato | — |
| `contact.untagged` | Tag removida do contato | — |
| `contact.deleted` | Contato excluído (soft delete) | Work (cancela tarefas abertas) |

### Eventos consumidos por este domínio

| Evento | Publicado por | Reação |
|---|---|---|
| `user.disabled` | Identity | Reatribui contatos do usuário desativado ao `defaultOwnerId` da organização |

---

## Regras de acesso consolidadas

| Role | Pode fazer |
|---|---|
| admin | CRUD completo em qualquer contato da organização; gerencia tags globais; cria Smart Lists para toda a equipe |
| agent | Cria contatos atribuídos a si mesmo; edita e exclui apenas contatos onde é responsável; cria Smart Lists pessoais; visualiza Smart Lists de outros agentes |
| viewer | Somente leitura — visualiza contatos, tags e Smart Lists sem poder criar, editar ou excluir |

---

## Códigos de erro consolidados do domínio

| Código | HTTP | Domínio de origem | Situação |
|---|---|---|---|
| `CONTACT_NOT_FOUND` | 404 | Registry | Contato não existe ou foi excluído |
| `CONTACT_DUPLICATE_EMAIL` | 409 | Registry | E-mail já cadastrado na organização |
| `CONTACT_MISSING_CONTACT_INFO` | 422 | Registry | E-mail e telefone ambos ausentes |
| `CONTACT_OWNER_INACTIVE` | 422 | Registry | Responsável selecionado está desativado |
| `CONTACT_AGENT_OWNER_MISMATCH` | 422 | Registry | Agent tentou atribuir a outro usuário |
| `CONTACT_FIELD_IMMUTABLE` | 422 | Registry | Tentativa de alterar campo imutável (`source`) |
| `IMPORT_INVALID_FILE` | 422 | Registry | Arquivo CSV inválido |
| `IMPORT_FILE_TOO_LARGE` | 422 | Registry | Arquivo excede tamanho máximo |
| `IMPORT_JOB_NOT_FOUND` | 404 | Registry | Job de importação não encontrado |
| `TAG_NAME_TOO_LONG` | 422 | Segmentation | Nome da tag excede 30 caracteres |
| `TAG_LIMIT_REACHED` | 422 | Segmentation | Contato já possui 20 tags |
| `TAG_NOT_FOUND` | 404 | Segmentation | Tag não existe no contato ou na organização |
| `SMART_LIST_NOT_FOUND` | 404 | Segmentation | Smart List não encontrada |
| `SMART_LIST_INVALID_FILTER` | 422 | Segmentation | Critério com campo ou operador não suportado |
| `SMART_LIST_NAME_DUPLICATE` | 409 | Segmentation | Já existe uma Smart List com esse nome |

---

## Endpoints consolidados do domínio

| Método | Rota | Feature Set | Feature |
|---|---|---|---|
| `GET` | `/api/v1/contacts` | Registry | Listagem com filtros |
| `POST` | `/api/v1/contacts` | Registry | Create Contact |
| `GET` | `/api/v1/contacts/:id` | Registry | Detalhe do contato |
| `PATCH` | `/api/v1/contacts/:id` | Registry | Edit Contact |
| `DELETE` | `/api/v1/contacts/:id` | Registry | Soft delete |
| `POST` | `/api/v1/contacts/import` | Registry | Import Contacts — inicia job |
| `GET` | `/api/v1/contacts/import/:jobId` | Registry | Import Contacts — status e relatório |
| `GET` | `/api/v1/tags` | Segmentation | Lista tags da organização |
| `POST` | `/api/v1/contacts/:id/tags` | Segmentation | Adiciona tags ao contato |
| `DELETE` | `/api/v1/contacts/:id/tags/:tag` | Segmentation | Remove tag do contato |
| `DELETE` | `/api/v1/tags/:tag` | Segmentation | Exclui tag da organização |
| `GET` | `/api/v1/smart-lists` | Segmentation | Lista Smart Lists |
| `POST` | `/api/v1/smart-lists` | Segmentation | Cria Smart List |
| `GET` | `/api/v1/smart-lists/:id` | Segmentation | Detalhe e contatos resultantes |
| `PATCH` | `/api/v1/smart-lists/:id` | Segmentation | Atualiza critérios |
| `DELETE` | `/api/v1/smart-lists/:id` | Segmentation | Exclui Smart List |

---

*Última revisão: —*
*Links: [Registry](registry/README.md) · [Segmentation](segmentation/README.md) · [INDEX geral](../../INDEX.md)*
