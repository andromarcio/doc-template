# PROMPT 3A — N3 Negócio
## Features · Parte negocial

> **Quem participa**: PO + dev (ou só PO)
> **Insumo necessário**: N1 do domínio + N2 do Feature Set escolhido
> **Entrega**: rascunho do .md de cada feature com objetivo, campos
> em linguagem de negócio, regras e cenários Gherkin negociais
>
> **Pré-requisito**: PROMPT_2B concluído para o Feature Set escolhido
> **Próximo passo**: após aprovação, usar PROMPT_3B com cada .md gerado

---

## INSTRUÇÕES PARA O CLAUDE

Você vai especificar features do ponto de vista de negócio.
Use exclusivamente linguagem de negócio — sem mencionar endpoints,
campos de banco, libs, FKs ou arquivos de código.

Regras da sessão:
- Trabalhe uma feature de cada vez, na ordem que eu indicar.
- Apresente as perguntas em blocos temáticos, um bloco de cada vez,
  aguardando minhas respostas antes de avançar.
- Ao completar todos os blocos, gere o artefato parcial e aguarde aprovação.
- Sinalize suposições com ⚠️.

---

## CONTEXTO DO PROJETO

=== MASTER.md ===
[cole aqui o conteúdo do MASTER.md]

=== DESIGN-SYSTEM.md ===
[cole aqui o conteúdo do DESIGN-SYSTEM.md]

=== N1 DO DOMÍNIO ===
[cole aqui o README.md do domínio]

=== N2 DO FEATURE SET ===
[cole aqui o README.md do Feature Set]

---

## PASSO 1 — Confirmação das features

Leia o N2 e liste as features identificadas. Pergunte:
> "Identifiquei as seguintes features em [Feature Set]: [lista].
> Qual delas deseja especificar primeiro?"

Aguarde minha escolha antes de prosseguir.

---

## PASSO 2 — Coleta negocial por blocos

Para cada feature que eu indicar, percorra os blocos abaixo em ordem.
Apresente um bloco de cada vez e aguarde minhas respostas.

---

### BLOCO A — Visão geral
> 1. O que esta funcionalidade faz, em uma frase para alguém
>    que nunca viu o sistema?
> 2. Quem a aciona: um usuário interno, um usuário externo
>    ou o próprio sistema automaticamente?

---

### BLOCO B — Campos em linguagem de negócio
> 3. Quais informações o usuário precisa preencher ou visualizar
>    nesta funcionalidade?
>    Para cada informação: nome em português, tipo (texto, número,
>    data, lista de opções, sim/não, arquivo), se é obrigatória
>    e qualquer regra de preenchimento que o usuário precisa saber.
>
> 4. Existe alguma informação que o sistema preenche sozinho,
>    sem o usuário precisar informar? Qual e quando?

---

### BLOCO C — Regras de negócio
> 5. Descreva o que acontece passo a passo quando tudo ocorre
>    como esperado (caminho feliz).
>
> 6. Existe alguma condição que impede ou altera o comportamento?
>    Exemplos: "só pode ser feito uma vez por dia",
>    "requer aprovação de um gerente", "depende de outro cadastro".
>
> 7. Quando esta funcionalidade é concluída, o sistema faz
>    algo automaticamente em seguida?
>    Exemplos: envia um e-mail, cria uma tarefa, notifica alguém.
>
> 8. Esta ação precisa ficar registrada no histórico para auditoria?
>    Se sim, o que é importante registrar?

---

### BLOCO D — Cenários alternativos
> 9. Quais erros o usuário pode cometer ao usar esta funcionalidade?
>    Para cada erro: o que aconteceu de errado e qual mensagem
>    deve ser exibida?
>
> 10. Pode ocorrer algum conflito com informações já existentes
>     no sistema? O que acontece nesse caso?
>
> 11. O que acontece se um usuário sem permissão tentar
>     usar esta funcionalidade?
>
> 12. Existe alguma situação especial no sistema que muda
>     o comportamento desta funcionalidade?
>     Exemplos: cadastro arquivado, período de carência, conta suspensa.

---

### BLOCO E — Interface
> 13. Onde esta funcionalidade aparece na tela?
>     É um formulário, uma janela pop-up, um botão em uma lista
>     ou uma página própria?
>
> 14. O que o usuário vê enquanto o sistema processa a ação?
>     O que aparece quando há um erro? O que aparece quando
>     não há dados para mostrar?
>
> 15. Qual é o retorno visual após a ação ser concluída?
>     Uma mensagem de confirmação, redirecionamento para outra
>     tela ou um relatório de resultado?

---

## PASSO 3 — Geração do artefato negocial

Com as respostas de todos os blocos, gere o artefato parcial:

📄 `modules/[dominio]/[feature-set]/[feature].md` — seções negociais

Seções geradas nesta etapa (visíveis para todos):
- Objetivo
- Campos (Label PO | Tipo | Obrigatório | Validação em linguagem natural)
- Campos preenchidos automaticamente (Label PO | Valor | Quando)
- Regras de negócio (lista numerada, linguagem de negócio)
- Cenários Gherkin — grupos negociais:
  - Caminho feliz
  - Erros de validação
  - Conflitos com dados existentes
  - Restrições de acesso
  - Estados especiais
- Comportamento de tela (loading, erro, empty state, sucesso)

Seções deixadas em branco para o PROMPT 3B:
- Mapeamento de campos para banco (`dev-only`)
- Cenários Gherkin técnicos (`dev-only`)
- Endpoints (`dev-only`)
- Eventos e AuditLog (`dev-only`)
- Arquivos e dependências (`dev-only`)
- Seção de Implementação (rastreabilidade)

Após apresentar, pergunte:
> "O N3 negocial de [feature] está correto e completo do ponto de vista
> de negócio? Ajusta algo ou avanço para a próxima feature?"

---

## PASSO 4 — Confirmação de cobertura

Após todas as features do Feature Set aprovadas, informe:
> "Parte negocial do N3 concluída para todas as features de [Feature Set].
> Para complementar com mapeamento técnico, endpoints e eventos,
> use o PROMPT_3B passando cada .md gerado aqui como contexto."
