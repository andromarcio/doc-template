<!--
  CONVENÇÃO DE VISIBILIDADE
  Blocos <div class="dev-only"> contêm detalhes técnicos.
  Versão PO  → CSS: .dev-only { display: none; }
  Versão DEV → sem CSS adicional
-->

# Feature Set: [Nome do Feature Set]
> **Nível 2** — Domínio: [Nome do Domínio]

## Responsabilidade
[Descrição em 2-3 frases do que este Feature Set faz.]

**Não faz**: [o que está explicitamente fora do escopo.]

---

## Features

| Feature | Arquivo | Descrição |
|---|---|---|
| [Nome da Feature] | [[feature].md](./ [feature].md) | [descrição em uma linha] |

---

## Fluxo principal

```
[Ponto de entrada do usuário]
          │
          ├─→ [[Feature 1]] ── [o que acontece]
          │         │
          │         ▼
          │   [resultado]
          │
          └─→ [[Feature 2]] ── [o que acontece]
                    │
                    ▼
              [resultado final]
```

---

## Dependências entre features

| Regra | Descrição |
|---|---|
| [Feature A] depende de [Feature B] | [por quê e como] |

---

## Telas

| Tela | Rota | Features atendidas |
|---|---|---|
| [Nome da tela] | `/[rota]` | [Feature 1], [Feature 2] |

---

## Permissões por perfil

| Perfil | [Feature 1] | [Feature 2] |
|---|---|---|
| [perfil admin] | [o que pode] | [o que pode] |
| [perfil agente] | [o que pode] | [o que pode] |
| [perfil viewer] | [o que pode] | [o que pode] |

---

<div class="dev-only">

## Campos do Feature Set

<!--
  Label PO para referência cruzada.
  Label Dev e campo banco: ver DATA-MODEL.md para cada entidade.
-->

| Label PO | Feature(s) | Entidade | → DATA-MODEL.md |
|---|---|---|---|
| [campo em português] | [Feature(s)] | [Entidade] | → ver DATA-MODEL.md: [Entidade] |

---

## Endpoints

| Método | Rota | Feature | Descrição |
|---|---|---|---|
| `[MÉTODO]` | `/api/v1/[rota]` | [Feature] | [descrição] |

---

## Eventos publicados e consumidos

| Evento | Tipo | Feature | Consumidores |
|---|---|---|---|
| `[entidade.acao]` | Publicado / Consumido | [Feature] | [quem consome] |

---

## Códigos de erro do Feature Set

| Código | HTTP | Feature | Situação |
|---|---|---|---|
| `[ENTIDADE_ERRO]` | [código] | [Feature] | [quando ocorre] |

</div>

---

*Domínio: [Nome do Domínio] · Última revisão: —*
*Links: [N1 do domínio](../README.md) · [INDEX geral](../../INDEX.md)*
