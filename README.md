# [Nome do Projeto] — Repositório de Documentação

Repositório central de especificações do sistema [Nome do Projeto].
Toda decisão de negócio e arquitetura começa aqui, antes de qualquer linha de código.

---

## Como usar este repositório

### Para o PO
1. Use os prompts em `prompts/` prefixados com `A` (PROMPT_1A, PROMPT_2A, PROMPT_3A)
2. Esses prompts conduzem a sessão em linguagem de negócio — sem jargão técnico
3. Abra um PR com o artefato gerado para revisão antes de avançar

### Para o Dev
1. Após aprovação da parte negocial, use os prompts prefixados com `B`
2. Cole o artefato negocial aprovado como contexto
3. Antes de implementar, confirme que o N3 está com status `📋 Especificado`
4. Campos novos aprovados durante sessões devem ser adicionados ao `global/DATA-MODEL.md`
5. Ao concluir a implementação, preencha a seção `Implementação` no N3 e atualize o `modules/INDEX.md`

### Fluxo completo
```
PO:  PROMPT_1A → N1 negocial → revisão → aprovação
Dev: PROMPT_1B → N1 técnico  → PR → merge → atualizar DATA-MODEL.md

PO:  PROMPT_2A → N2 negocial → revisão → aprovação
Dev: PROMPT_2B → N2 técnico  → PR → merge

PO:  PROMPT_3A → N3 negocial → revisão → aprovação
Dev: PROMPT_3B → N3 técnico  → PR → merge → implementação → atualiza status

Dev: PROMPT_SDD → SDD de implementação → guia o desenvolvimento
```

---

## Estrutura do repositório

```
[projeto]-docs/
├── README.md
├── .github/
│   └── pull_request_template.md       ← checklist automático em todo PR
├── global/                            ← colados em toda sessão com o Claude
│   ├── MASTER.md                      ← stack, convenções globais
│   ├── DESIGN-SYSTEM.md               ← padrões de UI e componentes
│   ├── DATA-MODEL.md                  ← FONTE ÚNICA de Label Dev e campo banco
│   ├── API-PATTERNS.md                ← padrões de API, erros, paginação
│   ├── FIELD-DICTIONARY.md            ← campos canônicos (CPF, CEP, e-mail...)
│   └── RULES-DICTIONARY.md            ← regras de negócio canônicas
├── modules/                           ← especificações FDD
│   ├── INDEX.md                       ← visão consolidada + rastreabilidade
│   └── [dominio]/
│       ├── README.md                  ← N1: visão do domínio
│       └── [feature-set]/
│           ├── README.md              ← N2: Feature Set
│           └── [feature].md           ← N3: feature individual
├── prompts/                           ← prompts prontos para uso
│   ├── SYSTEM_PROMPT_analista_requisitos.md
│   ├── PROMPT_1A_N1_negocio.md
│   ├── PROMPT_1B_N1_tecnico.md
│   ├── PROMPT_2A_N2_negocio.md
│   ├── PROMPT_2B_N2_tecnico.md
│   ├── PROMPT_3A_N3_negocio.md
│   ├── PROMPT_3A_N3_negocio_transcricao.md
│   ├── PROMPT_3B_N3_tecnico.md
│   └── PROMPT_SDD.md
├── decisions/                         ← ADRs (Architecture Decision Records)
│   └── ADR-000-template.md
├── changelogs/                        ← histórico de mudanças de spec
│   └── CHANGELOG-template.md
└── repos/                             ← mapa dos repositórios do sistema
    ├── INDEX.md
    └── _template-repo.md
```

---

## Princípio fundamental: Label Dev e campo banco vivem apenas no DATA-MODEL.md

Os artefatos N3 usam apenas **Label PO** (português, linguagem de negócio)
na tabela de campos. A nomenclatura técnica (Label Dev em camelCase e
campo banco em snake_case) está centralizada no `global/DATA-MODEL.md`.

Isso garante que:
- O PO nunca vê jargão técnico nas specs que ele valida
- Mudanças de nomenclatura técnica ocorrem em um único lugar
- Não há risco de divergência entre N3 e banco de dados

---

## Status de especificação

| Ícone | Status | Descrição |
|---|---|---|
| 📋 | Especificado | N3 completo, aguardando desenvolvimento |
| 🔄 | Em desenvolvimento | Implementação em andamento |
| ✅ | Implementado | Em produção, rastreabilidade preenchida |
| ⚠️ | Revisão necessária | Spec desatualizada em relação ao código |
| ❌ | Deprecado | Feature removida do sistema |

---

## Convenções de branch e PR

- Spec negocial: `spec/[dominio]-[feature]-negocio`
- Spec técnica: `spec/[dominio]-[feature]-tecnico`
- ADR: `decision/[numero]-[titulo]`
- Todo PR de N3 técnico referencia o PR do N3 negocial aprovado
- Todo PR de implementação nos repos de código referencia o N3 correspondente
