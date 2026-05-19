<!--
  CONVENÇÃO DE VISIBILIDADE
  ─────────────────────────────────────────────────────────────────
  Blocos <div class="dev-only"> contêm detalhes técnicos.
  Versão PO  → CSS: .dev-only { display: none; }
  Versão DEV → sem CSS adicional
  ─────────────────────────────────────────────────────────────────
-->

# Feature: [Nome da Feature]
> **Nível 3** — Feature Set: [Nome do Feature Set] — Domínio: [Nome do Domínio]

## Objetivo
[Descrição em 1-2 frases do que esta feature faz, em linguagem de negócio,
para alguém que nunca viu o sistema.]

---

## Campos

| Label PO | Label Dev | Obrigatório | Validação |
|---|---|---|---|
| [Nome do campo] | [camelCase] | sim/não/auto | [regras em linguagem natural] |

*[Notas sobre dependências entre campos, se houver.]*

### Campos preenchidos automaticamente pelo sistema

| Label PO | Label Dev | Valor | Quando |
|---|---|---|---|
| [campo] | [camelCase] | [valor fixo ou calculado] | [momento] |

<div class="dev-only">

### Mapeamento para o banco de dados

| Label Dev | Campo banco | Tipo SQL | Notas |
|---|---|---|---|
| [camelCase] | [snake_case] | [tipo] | [FK, enum values, constraints] |

</div>

---

## Regras de negócio

1. [Regra em linguagem de negócio — quem pode, o que acontece, quando]
2. [Regra de validação ou restrição]
3. [Ação automática disparada ao concluir]
4. [Regra de rastreabilidade/auditoria]

---

## Cenários de comportamento

```gherkin
Feature: [Nome da feature em linguagem natural]

  Background:
    Given que o usuário está autenticado na organização "[org]"
    And [contexto adicional comum a todos os cenários]

  # ── Caminho feliz ──────────────────────────────────────────────

  Scenario: [Descrição do cenário principal]
    Given [estado inicial]
    When [ação do usuário]
    Then [resultado esperado]
    And [efeito colateral esperado]

  # ── Erros de validação ─────────────────────────────────────────

  Scenario: [Campo obrigatório ausente]
    When o usuário deixa o campo "[campo]" vazio
    And clica em "[botão de ação]"
    Then [entidade] não é criada/alterada
    And o sistema exibe abaixo do campo: "[mensagem de erro]"

  Scenario: [Formato inválido]
    When o usuário preenche "[campo]" com "[valor inválido]"
    And clica em "[botão de ação]"
    Then [entidade] não é criada/alterada
    And o sistema exibe abaixo do campo: "[mensagem de erro]"

  # ── Conflitos com dados existentes ────────────────────────────

  Scenario: [Duplicata ou conflito]
    Given que já existe [registro] com [dado conflitante]
    When o usuário tenta [ação]
    Then [entidade] não é criada/alterada
    And o sistema exibe a mensagem: "[mensagem de erro]"

  # ── Restrições de acesso ───────────────────────────────────────

  Scenario: [Perfil sem permissão]
    Given que o usuário autenticado tem perfil "[perfil]"
    When o usuário tenta [ação]
    Then o sistema exibe a mensagem: "[mensagem de acesso negado]"

  # ── Estados especiais ──────────────────────────────────────────

  Scenario: [Situação especial do sistema]
    Given que [estado especial do sistema]
    When o usuário tenta [ação]
    Then [comportamento alterado]
    And o sistema exibe a mensagem: "[mensagem contextual]"
```

---

## Comportamento de tela

### Onde fica
[Descrever em qual rota e componente a feature aparece:
formulário em página própria, modal, botão em listagem, etc.]

### Estados da tela

| Estado | Comportamento |
|---|---|
| Loading | [o que exibir durante o processamento] |
| Erro de validação | [como exibir erros de campo] |
| Erro de servidor | [toast ou mensagem de erro genérico] |
| Sucesso | [toast, redirecionamento ou relatório] |
| Empty state | [quando e o que exibir se não há dados] |

<div class="dev-only">

---

## Cenários técnicos adicionais

```gherkin
  # ── Comportamento de sessão / técnico ─────────────────────────

  Scenario: [Cenário técnico]
    Given [estado técnico]
    When [ação técnica]
    Then [resultado técnico]
```

---

## Mapeamento de erros (código interno → mensagem ao usuário)

| Código | HTTP | Mensagem exibida ao usuário |
|---|---|---|
| `[ENTIDADE_ERRO]` | [código] | "[mensagem em português]" |

---

## API

### [MÉTODO] /api/v1/[rota]
**Acesso**: [público / autenticado — roles `[role1]`, `[role2]`]

**Body / Query params**:
```typescript
{
  campo: tipo        // [obrigatório/opcional]; [validação]
  campo?: tipo       // opcional
}
```

**Resposta de sucesso** — HTTP [código]:
```json
{
  "data": {
    "id": "uuid",
    "campo": "valor"
  },
  "meta": null
}
```

**Respostas de erro**:

| HTTP | Code | Situação |
|---|---|---|
| [código] | `[ENTIDADE_ERRO]` | [quando ocorre] |

---

## Eventos

### Publicados
| Evento | Quando | Payload | Consumidores |
|---|---|---|---|
| `[entidade.acao]` | [quando] | [campos principais] | [quem consome] |

### Consumidos
| Evento | Publicado por | Reação |
|---|---|---|
| `[entidade.acao]` | [Domínio] | [o que faz ao receber] |

---

## AuditLog

```typescript
logAction({
  organizationId: context.organizationId,
  userId: context.userId,
  action: '[entidade.acao]',
  targetEntity: '[Entidade]',
  targetId: [entidade].id,
  metadata: {
    [campo]: [valor]
  }
})
```

---

## Arquivos a criar ou alterar

```
[caminho/arquivo.ts]     ← [o que faz]
[caminho/arquivo.tsx]    ← [o que faz]
```

---

## Dependências

- **[Lib/Serviço]** — [para que é usado]

</div>

---

## Implementação

<!--
  Preenchido pelo dev após a implementação.
  Atualizar também o status no modules/INDEX.md.
-->

| Item | Repositório | Caminho | Branch/Tag |
|---|---|---|---|
| [endpoint/componente/job] | [repo] | [caminho no repo] | `main` |

**Status**: `[ ] Especificado` · `[ ] Em desenvolvimento` · `[ ] Implementado` · `[ ] Deprecado`

---

*Feature Set: [Nome do Feature Set] · Domínio: [Nome do Domínio] · Última revisão: —*
*Links: [N2 do Feature Set](./README.md) · [N1 do domínio](../README.md) · [INDEX geral](../../INDEX.md)*
