<!--
  CONVENÇÃO DE VISIBILIDADE
  ─────────────────────────────────────────────────────────────────
  Blocos <div class="dev-only"> contêm detalhes técnicos.
  Versão PO  → CSS: .dev-only { display: none; }
  Versão DEV → sem CSS adicional
  ─────────────────────────────────────────────────────────────────
-->

# Domínio: [Nome do Domínio]
> **Nível 1** — Visão estratégica do domínio

## Responsabilidade
[Descrição em 2-3 frases do que este domínio faz e para quem.]

### O que este domínio NÃO faz
| Responsabilidade | Pertence a |
|---|---|
| [o que não faz] | [Domínio responsável] |

---

## Feature Sets

| Feature Set | Pasta | Responsabilidade | Features |
|---|---|---|---|
| [Nome](./[pasta]/README.md) | `[dominio]/[pasta]/` | [descrição] | [N] |

---

## Regras transversais do domínio

1. [Regra que se aplica a todas as features deste domínio]
2. [Regra que se aplica a todas as features deste domínio]

---

## Integrações com outros domínios

### Leitura — domínios que consomem dados deste domínio
| Domínio | O que consome | Como |
|---|---|---|
| [Domínio] | [entidade/campo] | FK / Evento / Serviço |

### Escrita — domínios que criam ou alteram dados deste domínio
| Domínio | O que altera | Situação |
|---|---|---|
| [Domínio] | [entidade/campo] | [quando ocorre] |

---

### Eventos publicados por este domínio
| Evento | Situação | Consumidores |
|---|---|---|
| `[entidade.acao]` | [quando é publicado] | [quem consome] |

### Eventos consumidos por este domínio
| Evento | Publicado por | Reação |
|---|---|---|
| `[entidade.acao]` | [Domínio] | [o que faz ao receber] |

---

<div class="dev-only">

## Entidades do domínio

### [Nome da Entidade]
[Descrição em uma linha.]

| Label PO | Label Dev | Campo banco | Tipo | Obrigatório | Notas |
|---|---|---|---|---|---|
| [campo] | [camelCase] | [snake_case] | [tipo SQL] | sim/não/auto | [notas] |

---

## Dependências externas

| Serviço | Uso | Lib sugerida |
|---|---|---|
| [serviço] | [para que é usado] | [lib] |

---

## Regras de acesso consolidadas

| Role | Pode fazer |
|---|---|
| [role] | [permissões resumidas] |

---

## Endpoints consolidados do domínio

| Método | Rota | Feature Set | Feature |
|---|---|---|---|
| `[MÉTODO]` | `/api/v1/[rota]` | [Feature Set] | [Feature] |

---

## Códigos de erro do domínio

| Código | HTTP | Feature Set | Situação |
|---|---|---|---|
| `[DOMINIO_ERRO]` | [código] | [Feature Set] | [quando ocorre] |

</div>

---

*Última revisão: —*
*Links: [Feature Set 1](./[pasta]/README.md) · [INDEX geral](../INDEX.md)*
