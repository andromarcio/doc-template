# PROMPT 3A — N3 Negócio
## Features · Parte negocial

> **Quem participa**: PO + dev (ou só PO)
> **Insumo necessário**: N1 do domínio + N2 do Feature Set escolhido
> **Entrega**: rascunho do .md de cada feature com objetivo, campos
> em Label PO, regras e cenários Gherkin negociais
>
> **Pré-requisito**: PROMPT_2B concluído para o Feature Set escolhido
> **Próximo passo**: após aprovação, usar PROMPT_3B

---

## INSTRUÇÕES PARA O CLAUDE

Você vai especificar features do ponto de vista de negócio.
Use exclusivamente linguagem de negócio — sem mencionar endpoints,
campos de banco, libs, FKs ou arquivos de código.

Regras da sessão:
- Trabalhe uma feature de cada vez, na ordem que eu indicar.
- Apresente as perguntas em blocos temáticos, um bloco de cada vez.
- Ao completar todos os blocos, gere o artefato e aguarde aprovação.
- A tabela de campos usa apenas: Label PO, Tipo, Obrigatório e Validação
  em linguagem natural. Nunca inclua Label Dev ou campo banco.
- Campos canônicos (CPF, CEP, e-mail, etc.): aplicar FIELD-DICTIONARY
  automaticamente sem perguntar sobre suas regras de validação.
- Regras canônicas (maioridade, responsável ativo, etc.): aplicar
  RULES-DICTIONARY automaticamente sem perguntar sobre o comportamento.
- Perguntar apenas o que os dicionários deixam em aberto (parâmetros).
- Sinalize suposições com ⚠️.

---

## CONTEXTO DO PROJETO

=== MASTER.md ===
[cole aqui o conteúdo do MASTER.md]

=== DESIGN-SYSTEM.md ===
[cole aqui o conteúdo do DESIGN-SYSTEM.md]

=== FIELD-DICTIONARY.md ===
[cole aqui o conteúdo do FIELD-DICTIONARY.md]

=== RULES-DICTIONARY.md ===
[cole aqui o conteúdo do RULES-DICTIONARY.md]

=== N1 DO DOMÍNIO ===
[cole aqui o README.md do domínio]

=== N2 DO FEATURE SET ===
[cole aqui o README.md do Feature Set]

---

## PASSO 1 — Confirmação das features

Leia o N2 e liste as features. Pergunte:
> "Identifiquei as seguintes features em [Feature Set]: [lista].
> Qual delas deseja especificar primeiro?"

---

## PASSO 2 — Coleta negocial por blocos

Para cada feature, percorra os blocos abaixo em ordem.
Apresente um bloco de cada vez e aguarde minhas respostas.

---

### BLOCO A — Visão geral
> 1. O que esta funcionalidade faz, em uma frase para alguém
>    que nunca viu o sistema?
> 2. Quem a aciona: usuário interno, externo ou o próprio sistema?

---

### BLOCO B — Campos em linguagem de negócio

> 3. Quais informações o usuário preenche ou visualiza nesta funcionalidade?
>    Para cada informação: nome em português, tipo (texto, número, data,
>    lista de opções, sim/não, arquivo), se é obrigatória e qualquer
>    regra de preenchimento que o usuário precisa saber.
>
> 4. Existe alguma informação que o sistema preenche automaticamente?
>    Qual e quando?

Após receber os campos:
- Verificar se algum é canônico (CPF, CEP, e-mail, telefone, senha,
  data de nascimento, data futura, valor monetário, percentual, URL,
  nome de pessoa, razão social, CNPJ)
- Se for canônico: aplicar FIELD-DICTIONARY automaticamente e perguntar
  apenas o que o dicionário deixa em aberto (obrigatoriedade, unicidade, etc.)
- Se não for canônico: registrar Label PO, tipo e validações informadas

---

### BLOCO C — Regras de negócio
> 5. Descreva o que acontece passo a passo quando tudo ocorre
>    como esperado (caminho feliz).
>
> 6. Existe alguma condição que impede ou altera o comportamento?
>
> 7. Quando esta funcionalidade conclui, o sistema faz algo
>    automaticamente? (e-mail, tarefa, notificação)
>
> 8. Esta ação precisa ficar registrada no histórico de auditoria?

Após receber as regras:
- Verificar se alguma é canônica (maioridade, responsável ativo,
  período de vigência, aprovação antes de publicar, limite por organização,
  slug único público, reenvio com cooldown, arquivo com tamanho máximo,
  registro vinculado não pode ser excluído)
- Se for canônica: aplicar RULES-DICTIONARY e perguntar apenas os parâmetros
  que o dicionário deixa em aberto

---

### BLOCO D — Cenários alternativos
> 9. Quais erros o usuário pode cometer? Para cada erro: o que aconteceu
>    e qual mensagem deve ser exibida?
>
> 10. Pode ocorrer conflito com dados já existentes? O que acontece?
>
> 11. O que acontece se um usuário sem permissão tentar usar esta funcionalidade?
>
> 12. Existe alguma situação especial no sistema que muda o comportamento?
>     (cadastro arquivado, período de carência, conta suspensa)

---

### BLOCO E — Interface
> 13. Onde esta funcionalidade aparece na tela?
>     (formulário, modal, botão em lista, página própria)
>
> 14. O que o usuário vê durante o processamento? E em caso de erro?
>     E quando não há dados?
>
> 15. Qual o retorno visual após a ação? (toast, redirect, relatório)

---

## PASSO 3 — Geração do artefato negocial

Com as respostas de todos os blocos, gere:

📄 `modules/[dominio]/[feature-set]/[feature].md` — seções negociais

**Tabela de campos** (nunca incluir Label Dev ou campo banco):
```markdown
| Label PO | Tipo | Obrigatório | Validação |
|---|---|---|---|
| [nome em português] | [tipo] | sim/não/automático | [regra em linguagem natural] |
| [campo canônico] | [tipo] | [obrig.] | → ver FIELD-DICTIONARY: [nome] |
```

**Regras de negócio** (referenciar dicionários quando aplicável):
```markdown
1. [Regra específica desta feature]
2. [Regra canônica] → ver RULES-DICTIONARY: [nome] (parâmetro: [valor])
3. [Regra de domínio] → ver [N1]: Regras transversais: [N]
```

**Cenários Gherkin** — grupos negociais com marcadores de importação:
```gherkin
Scenario: [campo canônico inválido]
  # ← FIELD-DICTIONARY: [nome do campo] (importar cenários de validação)
  # Cenários adicionais específicos desta feature:
  When [situação específica]
  Then [resultado]

# ← RULES-DICTIONARY: [nome da regra] (importar cenários)
# Cenários adicionais específicos desta feature:
Scenario: [situação específica]
```

Seções geradas nesta etapa:
- Descrição
- Regras de negócio
- Cenários (Gherkin — grupos negociais)
- Campos (Label PO | Tipo | Obrigatório | Validação)
- Campos automáticos (Label PO | Valor | Quando)
- Comportamento de tela

Seções deixadas em branco para o PROMPT 3B:
- Mapeamento de campos (dev-only — referência ao DATA-MODEL.md)
- Cenários técnicos (dev-only)
- Endpoints (dev-only)
- Eventos e AuditLog (dev-only)
- Arquivos e dependências (dev-only)

Após apresentar, pergunte:
> "O N3 negocial de [feature] está correto do ponto de vista de negócio?
> Ajusta algo ou avanço para a próxima feature?"

---

## PASSO 4 — Confirmação de cobertura

Após todas as features aprovadas:
> "Parte negocial do N3 concluída para todas as features de [Feature Set].
> Para complementar com a parte técnica e atualizar o DATA-MODEL.md,
> use o PROMPT_3B passando cada .md gerado aqui como contexto."
