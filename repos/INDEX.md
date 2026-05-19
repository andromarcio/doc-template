# Repositórios do sistema

Mapa de todos os repositórios que compõem o sistema,
suas responsabilidades e como se relacionam.

---

## Repositórios

| Repositório | URL | Responsabilidade | Stack | Responsável |
|---|---|---|---|---|
| [nome-docs] | [URL] | Documentação e especificações | Markdown | [nome] |
| [nome-backend] | [URL] | [responsabilidade] | [stack] | [nome] |
| [nome-frontend] | [URL] | [responsabilidade] | [stack] | [nome] |
| [nome-workers] | [URL] | [responsabilidade] | [stack] | [nome] |

---

## Como rodar cada repositório

| Repositório | Comando | Porta | Pré-requisitos |
|---|---|---|---|
| [nome-backend] | `[comando]` | [porta] | [ex: Node 20, PostgreSQL] |
| [nome-frontend] | `[comando]` | [porta] | [ex: Node 20] |
| [nome-workers] | `[comando]` | — | [ex: Redis] |

---

## Variáveis de ambiente

| Variável | Repositório(s) | Descrição | Exemplo |
|---|---|---|---|
| `DATABASE_URL` | [backend] | String de conexão com o banco | `postgresql://...` |
| `JWT_SECRET` | [backend] | Chave de assinatura dos tokens | `[string longa]` |
| `GOOGLE_CLIENT_ID` | [backend] | OAuth Google | `[id].apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | [backend] | OAuth Google | `[secret]` |
| `SENDGRID_API_KEY` | [backend, workers] | Envio de e-mails | `SG.[key]` |
| `REDIS_URL` | [workers] | Conexão com Redis | `redis://...` |
| `NEXT_PUBLIC_API_URL` | [frontend] | URL base da API | `https://api.[dominio].com` |

---

## Relação entre repositórios

```
[nome-frontend]  ──→  [nome-backend]  ──→  PostgreSQL
                            │
                            └──→  [nome-workers]  ──→  Redis
                                        │
                                        ├──→  SendGrid
                                        ├──→  Twilio
                                        └──→  Evolution API
```

---

## Padrão de branches

| Branch | Propósito | Merge via |
|---|---|---|
| `main` | Produção | PR aprovado |
| `develop` | Desenvolvimento | PR aprovado |
| `feature/[nome]` | Nova feature | PR para develop |
| `fix/[nome]` | Correção de bug | PR para develop |
| `hotfix/[nome]` | Correção urgente em prod | PR para main e develop |

---

## Detalhamento por repositório

| Arquivo | Repositório |
|---|---|
| [crm-backend.md](./crm-backend.md) | Backend |
| [crm-frontend.md](./crm-frontend.md) | Frontend |
| [crm-workers.md](./crm-workers.md) | Workers |
