# API-PATTERNS.md
> Padrões globais de API. Todo endpoint gerado deve seguir este arquivo.
> Em caso de conflito entre este arquivo e um N3, este arquivo prevalece.

---

## Princípios gerais

- Toda API é **REST** com versionamento por prefixo: `/api/v1/`
- Toda requisição autenticada exige [descrever mecanismo de autenticação]
- Toda resposta tem `Content-Type: application/json`
- Toda rota filtra dados por `organizationId` extraído do token — nunca do body
- IDs em URLs e respostas são sempre **UUID**
- O servidor nunca retorna campos de senha, mesmo hasheados

---

## Envelope de resposta padrão

```typescript
// Sucesso com dado único
{ "data": { ...objeto }, "meta": null }

// Sucesso com lista
{
  "data": [...],
  "meta": { "total": 0, "nextCursor": null, "prevCursor": null }
}

// Sucesso sem conteúdo (ex: DELETE)
{ "data": { "id": "uuid" }, "meta": null }

// Erro
{
  "data": null,
  "error": {
    "code": "ENTIDADE_DESCRICAO_ERRO",
    "message": "Mensagem em inglês para logs",
    "details": [
      { "field": "nome_do_campo", "message": "Descrição do problema" }
    ]
  }
}
```

**Regras:**
- `data` e `error` são mutuamente exclusivos
- `message` sempre em inglês (para logs); mensagem ao usuário vem do frontend
- `details` apenas em erros de validação (HTTP 422)
- `meta` apenas em listagens; `null` em dado único

---

## Códigos HTTP

| Código | Quando usar |
|---|---|
| 200 | Sucesso geral (GET, PATCH, DELETE) |
| 201 | Recurso criado (POST) |
| 202 | Processamento aceito e assíncrono |
| 400 | Requisição malformada (JSON inválido) |
| 401 | Não autenticado |
| 403 | Autenticado, sem permissão |
| 404 | Recurso não encontrado (inclusive soft-deleted) |
| 409 | Conflito (duplicata, estado inválido) |
| 422 | Dados inválidos semanticamente (validação) |
| 429 | Rate limit atingido |
| 500 | Erro interno — nunca expor stack trace |

---

## Convenção de rotas

```
GET    /api/v1/{recurso}              → lista
POST   /api/v1/{recurso}              → cria
GET    /api/v1/{recurso}/:id          → detalhe
PATCH  /api/v1/{recurso}/:id          → atualiza parcialmente
DELETE /api/v1/{recurso}/:id          → soft delete
GET    /api/v1/{recurso}/:id/{sub}    → sub-recurso

# Ações especiais (verbos via POST)
POST   /api/v1/{recurso}/:id/archive
POST   /api/v1/{recurso}/:id/restore
POST   /api/v1/{recurso}/:id/[acao]
```

**Regras:**
- Sempre **plural** e **kebab-case**: `/smart-lists`, `/email-templates`
- Proibido verbos em rotas REST: não usar `/contacts/create`
- Usar PATCH (parcial) — nunca PUT (substituição total)

---

## Paginação

Sempre **cursor-based** — nunca offset/limit.

| Parâmetro | Tipo | Default | Descrição |
|---|---|---|---|
| `cursor` | string | null | Cursor da resposta anterior |
| `limit` | integer | 20 | Itens por página (teto: 100) |

```json
"meta": {
  "total": 134,
  "nextCursor": "eyJpZCI6MjF9",
  "prevCursor": "eyJpZCI6MX0="
}
```

---

## Filtros padrão

| Parâmetro | Comportamento |
|---|---|
| `search` | Busca full-text nos campos configurados |
| `sort` | Campo de ordenação |
| `order` | `asc` ou `desc` (default: `desc`) |
| `from` | Data de início — ISO 8601 |
| `to` | Data de fim — ISO 8601 |

- Parâmetros desconhecidos são **ignorados**
- Soft-deleted sempre excluídos das listagens
- Múltiplos filtros são sempre **AND**

---

## Códigos de erro globais

| Code | HTTP | Situação |
|---|---|---|
| `AUTH_UNAUTHENTICATED` | 401 | Token ausente ou inválido |
| `AUTH_TOKEN_EXPIRED` | 401 | Token expirado |
| `AUTH_FORBIDDEN` | 403 | Role sem permissão |
| `VALIDATION_ERROR` | 422 | Campos inválidos |
| `FIELD_IMMUTABLE` | 422 | Campo não pode ser alterado |
| `RESOURCE_NOT_FOUND` | 404 | Recurso não encontrado |
| `RATE_LIMIT_EXCEEDED` | 429 | Muitas requisições |
| `INTERNAL_ERROR` | 500 | Erro interno |

---

## Rate limiting

| Contexto | Limite | Janela |
|---|---|---|
| Rotas de autenticação | [X] requisições | 1 minuto |
| Rotas de envio (email, SMS) | [X] requisições | 1 minuto |
| Rotas autenticadas gerais | [X] requisições | 1 minuto |
| Rotas públicas | [X] requisições | 1 minuto |

Retornar HTTP 429 com header `Retry-After: {segundos}`.

---

## Eventos internos

Comunicação entre módulos via eventos — nunca chamada direta.

```typescript
// Publicar
await publishEvent('entidade.acao', {
  organizationId: '...',
  entityId: '...',
  // demais dados relevantes
})

// Consumir
onEvent('entidade.acao', async (payload) => { ... })
```

- Nome do evento: `{entidade}.{acao}` em snake_case
- Payload sempre inclui `organizationId` e ID da entidade principal
- Eventos são **assíncronos** — nunca bloquear a resposta HTTP

---

## Segurança

- **SQL Injection**: sempre queries parametrizadas — nunca interpolação
- **Logs**: nunca logar campos sensíveis (senha, token, cartão)
- **Stack trace**: nunca expor em produção
- **Campos sensíveis**: nunca retornar `password`, `passwordHash`, `refreshToken`
