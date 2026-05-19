# MASTER.md
> Arquivo de contexto global. Cole em toda sessão com o Claude,
> independente do módulo ou nível que está sendo trabalhado.

---

## Identificação do sistema

- **Nome**: [Nome do sistema]
- **Descrição**: [Uma frase descrevendo o propósito do sistema]
- **Versão atual**: [ex: 1.0.0]
- **Repositório de docs**: [URL do repo de documentação]

---

## Stack técnica

- **Frontend**: [ex: Next.js 14 (App Router), TypeScript, Tailwind CSS]
- **Backend**: [ex: Node.js + Express / Next.js API Routes]
- **Banco de dados**: [ex: PostgreSQL com Prisma ORM]
- **Autenticação**: [ex: NextAuth.js com Google Provider]
- **Fila / Jobs**: [ex: BullMQ + Redis]
- **Storage**: [ex: AWS S3 / Cloudflare R2]
- **E-mail**: [ex: SendGrid]
- **SMS**: [ex: Twilio]
- **Mensageria**: [ex: Evolution API (WhatsApp)]

---

## Repositórios do sistema

| Repositório | Responsabilidade |
|---|---|
| [nome-backend] | [ex: API REST, regras de negócio] |
| [nome-frontend] | [ex: Interface web] |
| [nome-workers] | [ex: Jobs assíncronos e filas] |
| [nome-docs] | Documentação e especificações (este repo) |

---

## Convenções de código

### Nomenclatura
- Componentes React: PascalCase, um arquivo por componente
- Funções e variáveis: camelCase
- Constantes: UPPER_SNAKE_CASE
- Rotas de API: kebab-case (ex: `/smart-lists`)
- Arquivos de teste: `[nome].spec.ts`

### TypeScript
- `strict: true` em todo o projeto
- Proibido o uso de `any` — usar `unknown` com type guard quando necessário
- Tipos de entidades gerados pelo Prisma — não redefinir manualmente

### Estrutura de pastas (exemplo Next.js)
```
/app
  /(auth)           → páginas protegidas
  /(public)         → páginas sem autenticação
  /api/v1           → rotas de API
/components
  /ui               → componentes genéricos reutilizáveis
  /[modulo]         → componentes específicos de cada módulo
/lib
  /db.ts            → instância do Prisma
  /auth.ts          → configuração de autenticação
  /events.ts        → publicação de eventos internos
  /audit.ts         → registro de auditoria
  /validations/     → schemas Zod por módulo
/services           → lógica de negócio separada dos controllers
```

---

## Convenções de banco de dados

### Nomenclatura de campos
| Camada | Convenção | Exemplo |
|---|---|---|
| Label PO | Português, title case | `Nome completo` |
| Label Dev | camelCase, inglês | `fullName` |
| Campo banco | [INFORMAR CONVENÇÃO DA ORGANIZAÇÃO] | `full_name` |

### Campos obrigatórios em toda tabela
| Campo banco | Tipo | Descrição |
|---|---|---|
| `id` | uuid | PK; gerado automaticamente |
| `organization_id` | uuid | FK → organizations; multitenancy |
| `created_at` | timestamptz | Gerado automaticamente |
| `updated_at` | timestamptz | Atualizado automaticamente |
| `deleted_at` | timestamptz | Soft delete; null = ativo |

---

## Regras globais de negócio

1. **Multitenancy**: toda query filtra obrigatoriamente por `organization_id`
2. **Soft delete universal**: registros nunca são removidos fisicamente
3. **IDs em URLs**: sempre UUID — nunca IDs sequenciais
4. **Paginação**: sempre cursor-based; padrão 20 itens; teto 100
5. **Validação**: Zod em frontend e backend; nunca confiar apenas no client
6. **Auditoria**: ações críticas sempre registradas em `AuditLog`

---

## Padrão de resposta de API

```typescript
// Sucesso com dado único
{ "data": { ...objeto }, "meta": null }

// Sucesso com lista
{ "data": [...], "meta": { "total": 0, "nextCursor": null, "prevCursor": null } }

// Erro
{ "data": null, "error": { "code": "ERRO_EXEMPLO", "message": "...", "details": [] } }
```

---

## O que NUNCA fazer

- Usar `any` no TypeScript
- Expor IDs sequenciais do banco em URLs ou respostas de API
- Retornar senhas ou tokens em respostas, mesmo hasheados
- Fazer query sem filtrar por `organization_id`
- Remover registros fisicamente do banco
- Lançar exceções cruas — sempre retornar envelope de erro padronizado
- Chamar diretamente outro módulo — usar eventos internos
