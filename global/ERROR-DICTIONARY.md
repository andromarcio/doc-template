# ERROR-DICTIONARY.md
> Dicionário centralizado de códigos de erro de API.
> Todo novo código de erro criado durante a especificação técnica (N3) deve ser registrado aqui para evitar duplicidade de status ou chaves, garantindo consistência no frontend (i18n).
>
> Padrão: `[DOMINIO]_[DESCRICAO]` em `SCREAMING_SNAKE_CASE`.

---

## Como referenciar nos artefatos

No N3 técnico (Mapeamento de erros), liste a chave correspondente:
`→ ver ERROR-DICTIONARY: AUTH_UNAUTHENTICATED`

---

## 1. Erros Globais (HTTP 4xx / 5xx)

Estes erros podem ocorrer em qualquer rota do sistema e não são específicos de um domínio.

| Código de Erro (Key) | HTTP | Motivo / Situação |
|---|---|---|
| `AUTH_UNAUTHENTICATED` | 401 | Token ausente ou assinatura inválida |
| `AUTH_TOKEN_EXPIRED` | 401 | Token válido, mas expirado |
| `AUTH_FORBIDDEN` | 403 | Usuário autenticado, mas sem privilégios para a ação (role incompatível) |
| `VALIDATION_ERROR` | 422 | Um ou mais campos no payload (body/query) são inválidos |
| `FIELD_IMMUTABLE` | 422 | Tentativa de via PATCH editar um campo protegido |
| `RESOURCE_NOT_FOUND` | 404 | Registro não existe no banco ou pretence a outra organização |
| `RATE_LIMIT_EXCEEDED` | 429 | Excedeu limite de requisições por IP ou Token |
| `INTERNAL_ERROR` | 500 | Falha genérica de servidor. Não expor stacktrace |

---

## 2. Erros de Identity

| Código de Erro (Key) | HTTP | Motivo / Situação |
|---|---|---|
| `AUTH_EMAIL_CONFLICT` | 409 | E-mail fornecido no cadastro já existe no banco |
| `AUTH_USER_DISABLED` | 403 | Tentativa de login com conta inativa (`deletedAt` not null) |
| `AUTH_INVALID_CREDENTIALS` | 401 | Senha e/ou e-mail não conferem no login local |

---

## 3. Erros de Contacts

| Código de Erro (Key) | HTTP | Motivo / Situação |
|---|---|---|
| `CONTACT_NOT_FOUND` | 404 | Contato solicitado não existe |
| `CONTACT_DUPLICATE_EMAIL` | 409 | Tentativa de vincular/alterar um e-mail já existente na base da organização |
| `TAG_LIMIT_REACHED` | 422 | Máximo de tags vinculadas ao contato atingido |

---

## 4. Erros de Communication

| Código de Erro (Key) | HTTP | Motivo / Situação |
|---|---|---|
| `MESSAGE_SEND_FAILED` | 502 | Gateway externo (SendGrid, Twilio) recusou a requisição |
| `TEMPLATE_NOT_FOUND` | 404 | EmailTemplate utilizado não existe |
| `COOLDOWN_ACTIVE` | 429 | Tentativa de reenvio de mensagem antes do fim do período de carência |

---

## 5. Erros de Work

| Código de Erro (Key) | HTTP | Motivo / Situação |
|---|---|---|
| `TASK_ALREADY_COMPLETED` | 409 | Tentativa de finalizar uma tarefa que já está em status 'done' |

---

## 6. Erros de Capture

| Código de Erro (Key) | HTTP | Motivo / Situação |
|---|---|---|
| `FORM_SLUG_TAKEN` | 409 | Slug (URL) de formulário já em uso por outro ativo na organização |
| `FORM_NOT_ACTIVE` | 403 | Tentativa de submissão a um formulário que está inativo/arquivado |

---

## Adicionando novos erros

Ao criar ou atualizar um N3 e identificar a necessidade de um erro não listado acima, registre-o no domínio correspondente com a seguinte estrutura:

```markdown
| `[DOMINIO]_[NOME]` | [HTTP] | [Situação que dispara o erro] |
```
