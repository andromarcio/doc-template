# Índice geral de módulos
> Visão consolidada de todos os domínios do sistema.
> Mantido via PROMPT 1A/1B — atualizar após cada N1 aprovado.

---

## Domínios

| Domínio | Pasta | Responsabilidade | Feature Sets |
|---|---|---|---|
| [Nome] | `modules/[dominio]/` | [responsabilidade em uma frase] | [N] |

---

## Rastreabilidade: spec → código

| Feature | Domínio | Status | Repositórios |
|---|---|---|---|
| [Feature] | [Domínio] | 📋 Especificado | — |
| [Feature] | [Domínio] | 🔄 Em desenvolvimento | [repo] |
| [Feature] | [Domínio] | ✅ Implementado | [repo1], [repo2] |
| [Feature] | [Domínio] | ⚠️ Revisão necessária | [repo] |
| [Feature] | [Domínio] | ❌ Deprecado | — |

---

## Entidades consolidadas

| Entidade | Domínio | N1 de origem |
|---|---|---|
| [Entidade] | [Domínio] | [link para README.md do domínio] |

---

## Eventos do sistema

| Evento | Publicado por | Consumido por | Payload principal |
|---|---|---|---|
| `[entidade.acao]` | [Domínio/Feature] | [Domínio/Feature] | [campos] |

---

## Mapa de integrações entre domínios

| Domínio origem | Depende de | Tipo | Descrição |
|---|---|---|---|
| [Domínio] | [Domínio] | Leitura / Escrita / Evento | [descrição] |

---

## Legenda de status

| Ícone | Status | Descrição |
|---|---|---|
| 📋 | Especificado | N3 completo, aguardando desenvolvimento |
| 🔄 | Em desenvolvimento | Implementação em andamento |
| ✅ | Implementado | Em produção, rastreabilidade preenchida |
| ⚠️ | Revisão necessária | Spec desatualizada em relação ao código |
| ❌ | Deprecado | Feature removida do sistema |
