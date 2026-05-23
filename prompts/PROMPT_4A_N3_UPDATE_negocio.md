# PROMPT 4A — N3 Update Negócio
## Atualização de Feature Existente · Parte negocial

> **Quem participa**: PO + dev (ou só PO)
> **Insumo necessário**: N3 existente aprovado + descrição da mudança desejada
> **Entrega**: diff ou versão atualizada do N3 (seção negocial) com as mudanças solicitadas.
>
> **Pré-requisito**: PROMPT_3A (e 3B) original já aprovado
> **Próximo passo**: após aprovação, usar PROMPT_4B

---

## INSTRUÇÕES PARA O CLAUDE

Você vai me ajudar a atualizar uma especificação de feature (N3) já existente no sistema do ponto de vista de negócio.
Você NÃO reescreverá tudo do zero, apenas aplicará a mudança solicitada sobre o contexto atual.

Regras da sessão:
- Trabalhe apenas na feature solicitada.
- Verifique se a mudança afeta outras regras, fluxos ou campos. Se sim, pergunte.
- Mantenha a restrição de linguagem de negócio — sem mencionar tabelas, campos de banco, endpoints ou tecnologias.
- Faça uma pergunta de cada vez.
- Sinalize suposições com ⚠️.

---

## CONTEXTO DO PROJETO

=== MASTER.md ===
[cole aqui o conteúdo do MASTER.md]

=== FIELD-DICTIONARY.md ===
[cole aqui o conteúdo do FIELD-DICTIONARY.md]

=== RULES-DICTIONARY.md ===
[cole aqui o conteúdo do RULES-DICTIONARY.md]

=== N3 EXISTENTE DA FEATURE ===
[cole aqui o .md negocial atual da feature]

---

## PASSO 1 — Identificação da mudança

Faça esta pergunta e aguarde:
> "O que você deseja alterar, adicionar ou remover nesta feature? Descreva a necessidade em linguagem de negócio."

---

## PASSO 2 — Avaliação de impacto negocial

Com base na resposta, avalie os seguintes pontos no N3 existente:
1. **Campos**: novos campos são necessários? Algum campo sai?
2. **Regras de Negócio**: essa mudança altera as regras atuais, ou insere uma nova?
3. **Cenários Gherkin**: que novos cenários surgem e quais se tornam obsoletos?
4. **Comportamento de Tela**: a UI precisará de mudanças?

Para cada ponto que você notar impacto, formule e faça perguntas para validar a mudança, UMA POR VEZ.
> Ex: "Notei que você quer adicionar 'Data de validade'. Esse campo será obrigatório?"

---

## PASSO 3 — Geração da Atualização

Após o alinhamento das perguntas do passo 2, gere a versão atualizada da seção negocial do N3, evidenciando o que foi alterado. Use a seção de CHANGELOG no arquivo, ou gere a tabela:

```markdown
## CHANGELOG
| Data | Autor | Tipo de Mudança | Descrição |
|---|---|---|---|
| [Data] | PO | [Novo Campo / Regra / Correção] | [O que mudou] |
```

Apresente as seções atualizadas. Pergunte:
> "A atualização negocial do N3 de [feature] está correta? Ajusta algo ou avanço para as partes técnicas via PROMPT_4B?"
