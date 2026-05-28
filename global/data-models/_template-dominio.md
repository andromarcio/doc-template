# Data Model: [Nome do Domínio]
> Fragmento do DATA-MODEL.md — cole apenas este arquivo nas sessões
> que envolvam o domínio [Nome do Domínio].
>
> **ALFs deste domínio**: [ALF 1] · [ALF 2]
> Detalhes de contagem: seção `## Arquivos Lógicos` no rodapé deste arquivo.

---

<!--
  CONVENÇÃO DE ALF
  ─────────────────────────────────────────────────────────────────
  Cada entidade deve ter uma anotação de ALF em seu cabeçalho:

  > **ALF: [Nome do ALF]** · entidade principal
  > **ALF: [Nome do ALF]** · entidade de suporte ([descrição do papel])
  > **AIE: [Nome da AIE]** · estrutura externa de [Sistema]

  Regras:
  - Uma entidade pertence a exatamente um ALF/AIE.
  - Tabelas de junção pura (sem campos próprios além das FKs) pertencem
    ao ALF da entidade principal do relacionamento.
  - Tabelas de auditoria (AuditLog) geralmente são um ALF próprio no
    domínio Identity — não criar ALF duplicado por domínio.
  - AIE: apenas quando o sistema consome dados de sistema externo
    (ex: estrutura de resposta do SendGrid, payload do Stripe).
  ─────────────────────────────────────────────────────────────────
-->

## [Entidade Principal]
> **ALF: [Nome do ALF]** · entidade principal

| Label PO | Label Dev | Campo banco | Tipo SQL | Obrigatório | Notas |
|---|---|---|---|---|---|
| [campo] | [camelCase] | [snake_case] | [tipo] | sim / não / automático | [notas] |

---

## [Entidade de Suporte]
> **ALF: [Nome do ALF]** · entidade de suporte ([papel no ALF])

| Label PO | Label Dev | Campo banco | Tipo SQL | Obrigatório | Notas |
|---|---|---|---|---|---|
| [campo] | [camelCase] | [snake_case] | [tipo] | sim / não / automático | [notas] |

---

## Arquivos Lógicos deste domínio

> DET calculado excluindo os 5 campos globais (id, organizationId, createdAt, updatedAt, deletedAt).
> Critérios de complexidade: ver `global/SIZING.md`.

| ALF / AIE | Tipo | Entidades constituintes | RET | DET | Complexidade | PF |
|---|---|---|---|---|---|---|
| [Nome do ALF] | ALF | [Entidade principal] (principal) · [Entidade de suporte] (subgrupo) | [N] | [N] | Baixa / Média / Alta | [PF] |
| [Nome da AIE] | AIE | [estrutura externa] | [N] | [N] | Baixa / Média / Alta | [PF] |

**Total deste domínio: [N] PF**

<details>
<summary>Memória de cálculo</summary>

**ALF: [Nome]**
- RET: [N] ([justificativa dos subgrupos])
- DET [Entidade 1]: [lista de campos contados] = [N]
- DET [Entidade 2]: [lista de campos contados] = [N]
- DET total: **[N]**
- Complexidade: RET [N] × DET [N] → tabela SIZING.md → **[Complexidade] → [PF] PF**

</details>
