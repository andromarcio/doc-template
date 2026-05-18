<!--
  CONVENÇÃO DE VISIBILIDADE
  ─────────────────────────────────────────────────────────────────
  Blocos marcados com <div class="dev-only"> contêm detalhes técnicos
  de implementação (API, campos de banco, eventos, dependências).

  Versão PO  → adicionar ao CSS: .dev-only { display: none; }
  Versão DEV → nenhum CSS adicional necessário
  ─────────────────────────────────────────────────────────────────
-->

# Feature: Criar Contato
> **Nível 3** — Feature Set: Registry — Domínio: Contacts

## Objetivo
Permitir que um usuário autenticado registre manualmente um novo contato
(lead, cliente ou prospect) na organização, preenchendo seus dados básicos
e definindo quem será o responsável pelo relacionamento.

---

## Campos

| Label PO | Label Dev | Obrigatório | Validação |
|---|---|---|---|
| Nome completo | fullName | sim | 2 a 120 caracteres |
| E-mail | email | não* | Formato válido; único por organização |
| Telefone | phone | não* | Formato E.164 (+5511999999999) |
| Responsável | ownerId | sim | Deve ser um usuário ativo da organização |
| Tags | tags | não | Máximo 20 tags; cada tag com até 30 caracteres |
| Anotações | notes | não | Máximo 5.000 caracteres |

*E-mail e telefone não podem ser ambos vazios simultaneamente (ver Regra 2).

### Campos preenchidos automaticamente pelo sistema

| Label PO | Label Dev | Valor |
|---|---|---|
| Origem | contactSource | `manual` (fixo para criação pelo usuário) |
| Data de criação | createdAt | Data e hora do momento da criação |
| Organização | organizationId | Extraído da sessão do usuário autenticado |

<div class="dev-only">

### Mapeamento para o banco de dados

| Label Dev | Campo banco | Tipo | Notas |
|---|---|---|---|
| fullName | full_name | varchar(120) | |
| email | email | varchar(254) | Nullable; unique por organization_id |
| phone | phone | varchar(20) | Nullable; formato E.164 |
| ownerId | owner_id | uuid | FK → users.id |
| tags | tags | text[] | Array de strings |
| notes | notes | text | Nullable |
| contactSource | source | enum | manual, form, import, api |
| organizationId | organization_id | uuid | FK → organizations.id |
| createdAt | created_at | timestamptz | Gerado pelo banco |
| updatedAt | updated_at | timestamptz | Atualizado automaticamente |
| deletedAt | deleted_at | timestamptz | Null = ativo; soft delete |

</div>

---

## Regras de negócio

1. Apenas usuários com role **admin** ou **agent** podem criar contatos.
   Usuários com role **viewer** não têm acesso à ação de criação.

2. O contato deve ter ao menos **e-mail ou telefone** preenchido.
   Não é permitido cadastrar um contato apenas com nome.

3. O **e-mail é único por organização**. Não é possível cadastrar dois contatos
   com o mesmo e-mail na mesma organização, independente do responsável.

4. O campo **Responsável** deve ser um usuário ativo da organização.
   Usuários desativados não aparecem na lista de seleção e não podem
   ser atribuídos como responsáveis.

5. Usuários com role **agent** só podem criar contatos atribuindo
   a si mesmos como responsável. Somente **admin** pode atribuir
   a outro usuário no momento da criação.

6. **Tags** são criadas automaticamente ao serem digitadas.
   Não há cadastro prévio de tags — qualquer texto digitado vira uma tag.

7. Toda criação de contato é registrada no **histórico de auditoria**
   com o evento `contact.created` e os dados do usuário que criou.

8. Ao ser criado, o sistema publica o evento `contact.created` para
   que outros módulos possam reagir (ex: notificação ao responsável).

---

## Cenários de comportamento

```gherkin
Feature: Criar contato manualmente

  Background:
    Given que o usuário está autenticado na organização "acme"
    And está na tela de criação de contato

  # ── Caminho feliz ──────────────────────────────────────────────

  Scenario: Admin cria contato completo atribuído a outro usuário
    Given que o usuário autenticado tem role "admin"
    And existe um usuário ativo "Maria Silva" na organização
    When o usuário preenche os campos:
      | Nome completo | João Pereira           |
      | E-mail        | joao@empresa.com       |
      | Telefone      | +5511999990000         |
      | Responsável   | Maria Silva            |
      | Tags          | cliente, prioritário   |
      | Anotações     | Veio indicado por Ana  |
    And clica em "Salvar contato"
    Then o contato "João Pereira" é criado com todos os dados informados
    And o campo "Origem" é definido como "manual" automaticamente
    And o evento "contact.created" é publicado com o id do novo contato
    And um registro é criado no histórico de auditoria
    And o usuário é redirecionado para a página de detalhe do contato

  Scenario: Agent cria contato atribuído a si mesmo
    Given que o usuário autenticado tem role "agent"
    When o usuário preenche os campos:
      | Nome completo | Ana Costa        |
      | E-mail        | ana@empresa.com  |
      | Responsável   | (próprio usuário)|
    And clica em "Salvar contato"
    Then o contato "Ana Costa" é criado com sucesso
    And o responsável é o próprio usuário que criou

  Scenario: Contato criado apenas com telefone (sem e-mail)
    Given que o usuário autenticado tem role "agent"
    When o usuário preenche:
      | Nome completo | Pedro Lima     |
      | Telefone      | +5521988880000 |
      | Responsável   | (próprio usuário)|
    And clica em "Salvar contato"
    Then o contato "Pedro Lima" é criado com sucesso
    And o campo "E-mail" permanece vazio

  # ── Erros de validação ─────────────────────────────────────────

  Scenario: Tentativa de salvar sem nome
    When o usuário deixa o campo "Nome completo" vazio
    And clica em "Salvar contato"
    Then o contato não é criado
    And o sistema exibe abaixo do campo: "O nome é obrigatório"

  Scenario: Tentativa de salvar sem e-mail e sem telefone
    When o usuário preenche apenas o campo "Nome completo" com "Lucas Souza"
    And deixa "E-mail" e "Telefone" vazios
    And clica em "Salvar contato"
    Then o contato não é criado
    And o sistema exibe a mensagem:
      "Informe ao menos um e-mail ou telefone para o contato."

  Scenario: E-mail com formato inválido
    When o usuário preenche "E-mail" com "nao-e-um-email"
    And clica em "Salvar contato"
    Then o contato não é criado
    And o sistema exibe abaixo do campo: "Informe um e-mail válido"

  Scenario: Telefone com formato inválido
    When o usuário preenche "Telefone" com "99999999"
    And clica em "Salvar contato"
    Then o contato não é criado
    And o sistema exibe abaixo do campo:
      "Informe o telefone no formato internacional: +5511999999999"

  Scenario: Nome com menos de 2 caracteres
    When o usuário preenche "Nome completo" com "A"
    And clica em "Salvar contato"
    Then o contato não é criado
    And o sistema exibe abaixo do campo: "O nome deve ter ao menos 2 caracteres"

  Scenario: Anotações com mais de 5.000 caracteres
    When o usuário preenche "Anotações" com um texto de 5.001 caracteres
    Then o campo para de aceitar novos caracteres ao atingir 5.000
    And o sistema exibe um contador: "5000/5000 caracteres"

  # ── Conflitos com dados existentes ────────────────────────────

  Scenario: E-mail já cadastrado na organização
    Given que já existe um contato com o e-mail "joao@empresa.com" na organização "acme"
    When o usuário tenta criar um novo contato com o e-mail "joao@empresa.com"
    And clica em "Salvar contato"
    Then o contato não é criado
    And o sistema exibe abaixo do campo:
      "Este e-mail já está cadastrado. Ver contato existente."
    And o texto "Ver contato existente" é um link para o contato duplicado

  # ── Restrições de acesso ───────────────────────────────────────

  Scenario: Viewer tenta acessar a criação de contato
    Given que o usuário autenticado tem role "viewer"
    When o usuário tenta acessar a tela de criação de contato
    Then o sistema exibe a mensagem:
      "Você não tem permissão para criar contatos."
    And o botão "Salvar contato" não está disponível

  Scenario: Agent tenta atribuir contato a outro usuário
    Given que o usuário autenticado tem role "agent"
    When o usuário seleciona outro usuário no campo "Responsável"
    Then o sistema ignora a seleção e mantém o próprio usuário como responsável
    And exibe a mensagem informativa:
      "Agentes só podem criar contatos atribuídos a si mesmos."

  # ── Estados especiais ──────────────────────────────────────────

  Scenario: Responsável selecionado é desativado antes de salvar
    Given que o usuário selecionou "Carlos Lima" como responsável
    And "Carlos Lima" é desativado por um admin antes de o formulário ser salvo
    When o usuário clica em "Salvar contato"
    Then o contato não é criado
    And o sistema exibe a mensagem:
      "O responsável selecionado não está mais ativo. Escolha outro responsável."

  Scenario: Sessão expira durante o preenchimento do formulário
    Given que o usuário está preenchendo o formulário
    When a sessão do usuário expira
    And o usuário clica em "Salvar contato"
    Then o sistema redireciona para a tela de login
    And exibe a mensagem: "Sua sessão expirou. Faça login para continuar."
```

---

## Comportamento de tela

### Onde fica
A criação de contato ocorre de duas formas:

- **Modal de criação rápida**: acionado pelo botão "Novo contato" na listagem
  (`/contacts`). Contém apenas os campos obrigatórios e essenciais.
- **Página de criação completa**: rota `/contacts/new`. Contém todos os campos
  incluindo tags e anotações. Acessada pelo link "Preencher formulário completo"
  dentro do modal.

### Estados da tela

| Estado | Comportamento |
|---|---|
| Loading (salvando) | Botão "Salvar contato" desabilitado com spinner; campos bloqueados |
| Erro de validação | Mensagem exibida abaixo do campo inválido; foco movido para o primeiro erro |
| Erro de servidor | Toast de erro no topo: "Não foi possível salvar. Tente novamente." |
| Sucesso | Toast de sucesso: "Contato criado com sucesso." + redirect para o detalhe |

### Campo Responsável
- Exibe um select com busca por nome
- Lista apenas usuários ativos da organização
- Para role **agent**: campo pré-preenchido com o próprio usuário e bloqueado para edição
- Para role **admin**: campo editável, sem pré-seleção

### Campo Tags
- Input com autocomplete das tags já existentes na organização
- Permite criar tags novas digitando e pressionando Enter ou vírgula
- Exibe as tags selecionadas como chips removíveis
- Ao atingir 20 tags, o input é desabilitado

<div class="dev-only">

---

## API

### POST /api/v1/contacts

**Acesso**: autenticado — roles `admin` e `agent`

**Body**:
```typescript
{
  fullName: string        // obrigatório; 2–120 chars
  email?: string          // opcional; formato válido
  phone?: string          // opcional; formato E.164
  ownerId: string         // obrigatório; UUID de usuário ativo
  tags?: string[]         // opcional; máx 20 itens, cada um máx 30 chars
  notes?: string          // opcional; máx 5000 chars
}
```

**Resposta de sucesso** — HTTP 201:
```json
{
  "data": {
    "id": "uuid",
    "fullName": "João Pereira",
    "email": "joao@empresa.com",
    "phone": "+5511999990000",
    "ownerId": "uuid-maria",
    "tags": ["cliente", "prioritário"],
    "notes": "Veio indicado por Ana",
    "contactSource": "manual",
    "organizationId": "uuid-acme",
    "createdAt": "2024-06-01T14:00:00Z",
    "updatedAt": "2024-06-01T14:00:00Z"
  },
  "meta": null
}
```

**Respostas de erro**:

| Código HTTP | code | Situação |
|---|---|---|
| 401 | AUTH_UNAUTHENTICATED | Token ausente ou inválido |
| 403 | AUTH_FORBIDDEN | Role viewer tentando criar |
| 409 | CONTACT_DUPLICATE_EMAIL | E-mail já existe na organização |
| 422 | VALIDATION_ERROR | Campos inválidos (ver details) |
| 422 | CONTACT_MISSING_CONTACT_INFO | E-mail e telefone ambos ausentes |
| 422 | CONTACT_OWNER_INACTIVE | Usuário do ownerId está desativado |
| 422 | CONTACT_AGENT_OWNER_MISMATCH | Agent tentou atribuir a outro usuário |

**Exemplo de erro 422 com details**:
```json
{
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      { "field": "email", "message": "Invalid email format" },
      { "field": "fullName", "message": "Must be at least 2 characters" }
    ]
  }
}
```

---

## Evento publicado

```typescript
// Evento: contact.created
// Publicado após inserção bem-sucedida no banco
{
  event: "contact.created",
  payload: {
    organizationId: string,
    contactId: string,
    source: "manual",
    createdBy: string   // userId do usuário autenticado
  }
}
```

**Consumidores conhecidos**:
- Work / Notifications → notifica o responsável sobre novo contato atribuído

---

## AuditLog

```typescript
logAction({
  organizationId: context.organizationId,
  userId: context.userId,           // quem criou
  action: "contact.created",
  targetEntity: "Contact",
  targetId: contact.id,
  metadata: {
    fullName: contact.fullName,
    source: "manual",
    ownerId: contact.ownerId
  }
})
```

---

## Arquivos a criar ou alterar

```
app/api/v1/contacts/route.ts              ← endpoint POST (criar)
app/(auth)/contacts/new/page.tsx          ← página de criação completa
components/contacts/ContactForm.tsx       ← formulário reutilizável (modal + página)
components/contacts/ContactFormModal.tsx  ← wrapper modal para criação rápida
components/ui/TagInput.tsx                ← componente de input de tags (se não existir)
lib/validations/contact.ts               ← schema Zod de criação
lib/services/contact.service.ts          ← lógica de criação e verificação de duplicata
lib/events.ts                            ← publishEvent (se não existir)
```

---

## Dependências

- **Prisma** — escrita em `Contact`, leitura em `User` (validar ownerId)
- **Zod** — validação do body da requisição
- **lib/audit.ts** — função `logAction`
- **lib/events.ts** — função `publishEvent`

</div>

---

*Feature Set: Registry · Domínio: Contacts · Última revisão: —*
