# [Nome do Projeto] — Repositório de Documentação

Repositório central de especificações do sistema [Nome do Projeto].
Toda decisão de negócio e arquitetura começa aqui, antes de qualquer linha de código.

---

## Como usar este repositório

### Para o PO
1. Use os prompts em `prompts/` prefixados com `A` (ex: `PROMPT_1A`, `PROMPT_2A`, `PROMPT_3A`)
2. Esses prompts conduzem a sessão em linguagem de negócio — sem jargão técnico
3. Abra um PR com o artefato gerado para revisão do time antes de avançar

### Para o Dev
1. Após aprovação da parte negocial, use os prompts prefixados com `B`
2. Cole o artefato negocial aprovado como contexto
3. Antes de implementar, confirme que o N3 da feature está com status `Especificado`
4. Ao concluir a implementação, atualize o status no N3 e no `modules/INDEX.md`

### Fluxo completo
```
PO: PROMPT_1A → N1 negocial → revisão → aprovação
Dev: PROMPT_1B → N1 técnico → PR → merge

PO: PROMPT_2A → N2 negocial → revisão → aprovação
Dev: PROMPT_2B → N2 técnico → PR → merge

PO: PROMPT_3A → N3 negocial → revisão → aprovação
Dev: PROMPT_3B → N3 técnico → PR → merge → implementação → atualiza status
```

---

## Estrutura do repositório

```
[projeto]-docs/
├── README.md                        ← este arquivo
├── global/                          ← colados em toda sessão com o Claude
│   ├── MASTER.md                    ← stack, convenções globais
│   ├── DESIGN-SYSTEM.md             ← padrões de UI e componentes
│   ├── DATA-MODEL.md                ← entidades, campos, mapeamento
│   └── API-PATTERNS.md              ← padrões de API, erros, paginação
├── modules/                         ← especificações FDD
│   ├── INDEX.md                     ← visão consolidada + rastreabilidade
│   └── [dominio]/
│       ├── README.md                ← N1: visão do domínio
│       └── [feature-set]/
│           ├── README.md            ← N2: Feature Set
│           └── [feature].md         ← N3: feature individual
├── prompts/                         ← prompts prontos para uso
├── decisions/                       ← ADRs (Architecture Decision Records)
├── changelogs/                      ← histórico de mudanças de spec
└── repos/                           ← mapa dos repositórios do sistema
```

---

## Status de especificação

Cada N3 usa um dos seguintes status:

| Status | Significado |
|---|---|
| 📋 Especificado | N3 completo, aguardando desenvolvimento |
| 🔄 Em desenvolvimento | Implementação em andamento |
| ✅ Implementado | Código em produção, rastreabilidade preenchida |
| ⚠️ Revisão necessária | Spec desatualizada em relação ao código |
| ❌ Deprecado | Feature removida do sistema |

---

## Convenções de branch e PR

- Branch de spec: `spec/[dominio]-[feature]` (ex: `spec/contacts-create-contact`)
- Branch de ADR: `decision/[numero]-[titulo]` (ex: `decision/001-cursor-pagination`)
- Todo PR de N3 técnico deve referenciar o PR do N3 negocial aprovado
- Todo PR de implementação nos repos de código deve referenciar o N3 correspondente
