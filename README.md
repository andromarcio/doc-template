# [Nome do Projeto] — Repositório de Documentação

Repositório central de especificações do sistema [Nome do Projeto].
Toda decisão de negócio e arquitetura começa aqui, antes de qualquer linha de código.

---

## Como usar

### Para o PO
1. Use os prompts prefixados com `A` ou `0` (PROMPT_0, PROMPT_1A, PROMPT_2A, PROMPT_3A, PROMPT_4A)
2. Esses prompts conduzem a sessão em linguagem de negócio — sem jargão técnico
3. Abra um PR com o artefato gerado para revisão antes de avançar

### Para o Dev
1. Após aprovação negocial, use os prompts prefixados com `B` (PROMPT_1B, PROMPT_2B, PROMPT_3B, PROMPT_4B)
2. Cole apenas o fragmento `global/data-models/[dominio].md` relevante — não o DATA-MODEL inteiro
3. Campos novos → `global/data-models/[dominio].md`. Erros novos → `global/ERROR-DICTIONARY.md`
4. Ao implementar: preencha a seção `Implementação` no N3 e atualize `modules/INDEX.md`

### Para o QA
1. Use o PROMPT_QA após o N3 estar com status `📋 Especificado`
2. Escolha o framework (Playwright, Cypress, Cucumber, roteiro manual)

### Fluxo completo
```
[Opcional] PROMPT_0  → extrai insumos desestruturados → Raw Spec Document

PO:  PROMPT_1A → N1 negocial → revisão → aprovação
Dev: PROMPT_1B → N1 técnico + data-models/[dominio].md atualizado

PO:  PROMPT_2A → N2 negocial → revisão → aprovação
Dev: PROMPT_2B → N2 técnico completo

PO:  PROMPT_3A → N3 negocial → revisão → aprovação
Dev: PROMPT_3B → N3 técnico + data-models/[dominio].md atualizado

Dev: PROMPT_SDD → documento de design → guia a implementação
QA:  PROMPT_QA  → plano de testes E2E

[Manutenção]
PO:  PROMPT_4A → atualização negocial do N3
Dev: PROMPT_4B → atualização técnica + verificação de breaking changes
```

---

## Estrutura do repositório

```
[projeto]-docs/
├── README.md
├── N0_PRODUCT_VISION.md               ← Visão estratégica, personas, KPIs
├── .github/
│   └── pull_request_template.md
├── global/
│   ├── MASTER.md                      ← Stack, convenções globais
│   ├── DESIGN-SYSTEM.md               ← Padrões de UI
│   ├── DATA-MODEL.md                  ← Índice + campos globais + enums
│   ├── data-models/                   ← Fragmentos por domínio (cole só o relevante)
│   │   ├── identity.md
│   │   ├── contacts.md
│   │   ├── communication.md
│   │   ├── work.md
│   │   └── capture.md
│   ├── API-PATTERNS.md
│   ├── ERROR-DICTIONARY.md            ← Fonte única de códigos de erro
│   ├── FIELD-DICTIONARY.md            ← Campos canônicos (CPF, CEP, e-mail...)
│   └── RULES-DICTIONARY.md            ← Regras de negócio canônicas
├── modules/
│   ├── INDEX.md                       ← Rastreabilidade spec → código
│   └── [dominio]/
│       ├── README.md                  ← N1
│       └── [feature-set]/
│           ├── README.md              ← N2
│           └── [feature].md           ← N3
├── prompts/
│   ├── SYSTEM_PROMPT_analista_requisitos.md
│   ├── PROMPT_0_EXTRACTION.md         ← Extração de insumos desestruturados
│   ├── PROMPT_1A_N1_negocio.md
│   ├── PROMPT_1B_N1_tecnico.md
│   ├── PROMPT_2A_N2_negocio.md
│   ├── PROMPT_2B_N2_tecnico.md
│   ├── PROMPT_3A_N3_negocio.md
│   ├── PROMPT_3A_N3_negocio_transcricao.md
│   ├── PROMPT_3B_N3_tecnico.md
│   ├── PROMPT_4A_N3_UPDATE_negocio.md ← Manutenção de N3 existente (PO)
│   ├── PROMPT_4B_N3_UPDATE_tecnico.md ← Manutenção de N3 existente (Dev)
│   ├── PROMPT_QA.md                   ← Geração de testes E2E
│   ├── PROMPT_PROTOTYPE_FLOW_FULL.md      ← fluxo completo (sidebar + topbar)
│   ├── PROMPT_PROTOTYPE_FLOW_COMPONENT.md ← fluxo só da área de conteúdo
│   ├── PROMPT_PROTOTYPE_SCREEN_FULL.md    ← estados completos (sidebar + topbar)
│   ├── PROMPT_PROTOTYPE_SCREEN_COMPONENT.md ← estados só da área de conteúdo
│   └── PROMPT_SDD.md
├── decisions/
│   └── ADR-000-template.md
├── changelogs/
│   └── CHANGELOG-template.md
└── repos/
    ├── INDEX.md
    └── _template-repo.md
```

---

## Princípios fundamentais

**1. Label Dev e campo banco vivem apenas em `global/data-models/`**
Os N3 usam apenas Label PO. Isso evita divergências entre spec e banco.

**2. Códigos de erro vivem apenas no `global/ERROR-DICTIONARY.md`**
Nenhum N3 cria códigos novos sem registrar aqui primeiro.

**3. DATA-MODEL é fragmentado por domínio**
Cole apenas o fragmento relevante nas sessões — não o arquivo inteiro.
Isso evita o efeito "Lost in the Middle" em contextos longos.

**4. O LLM opera como Máquina de Estados**
Cada resposta informa explicitamente o estado atual, garantindo
que o fluxo de perguntas nunca se quebre em sessões longas.

**5. N0 balizea as inferências do LLM**
Inclua o `N0_PRODUCT_VISION.md` ao iniciar novos domínios ou Feature Sets.

---

## Status de especificação

| Ícone | Status | Descrição |
|---|---|---|
| 📋 | Especificado | N3 completo, aguardando desenvolvimento |
| 🔄 | Em desenvolvimento | Implementação em andamento |
| ✅ | Implementado | Em produção, rastreabilidade preenchida |
| ⚠️ | Revisão necessária | Spec desatualizada em relação ao código |
| ❌ | Deprecado | Feature removida do sistema |
