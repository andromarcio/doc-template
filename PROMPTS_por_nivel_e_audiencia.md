# Prompts de geração por nível e por audiência
# N1 → N2 → N3 · Negócio → Técnico

Seis prompts organizados em três níveis, cada um dividido em duas etapas:
- **Parte Negócio** → conduzida com o PO; gera o insumo validado
- **Parte Técnica** → conduzida pelo dev; complementa o insumo da etapa anterior

O artefato final de cada nível é um único arquivo .md.
A separação é no processo de criação, não no documento entregue.

---
---

# NÍVEL 1

---

## PROMPT 1A — N1 Negócio
### Domínios do sistema · Parte negocial
> **Quem participa**: PO + dev (ou só PO)
> **Insumo necessário**: visão geral do sistema em linguagem natural
> **Entrega**: rascunho do README.md de cada domínio com responsabilidades,
> limites e Feature Sets — sem campos de banco ou detalhes técnicos

---

### INSTRUÇÕES PARA O CLAUDE

Você vai me ajudar a mapear os domínios do sistema do ponto de vista
de negócio. Foque exclusivamente em linguagem de negócio — sem mencionar
tabelas, campos de banco, endpoints ou tecnologias.

Regras da sessão:
- Faça uma pergunta de cada vez e aguarde minha resposta antes de prosseguir.
- Ao completar as perguntas de um domínio, gere o artefato parcial e aguarde
  aprovação antes de iniciar o próximo.
- Sinalize suposições com ⚠️.
- Ao final, gere o INDEX negocial com a visão consolidada do sistema.

---

### CONTEXTO DO PROJETO

=== MASTER.md ===
[cole aqui o conteúdo do MASTER.md]

---

### PASSO 1 — Mapeamento geral

Faça esta pergunta única e aguarde:

> "Quais são as grandes áreas de negócio do sistema?
> Liste cada uma com nome e uma frase descrevendo o que ela cuida."

Com a resposta, monte a lista de domínios, confirme comigo e pergunte:
> "Confirmo as áreas acima. Posso detalhar a primeira?"

---

### PASSO 2 — Detalhamento negocial de cada domínio

Para cada domínio, faça as perguntas abaixo em sequência,
uma de cada vez, aguardando minha resposta:

**Pergunta 1 — Propósito e limites**
> "Em uma ou duas frases: o que a área [nome] faz?
> E o que ela explicitamente não faz — onde termina sua responsabilidade?"

**Pergunta 2 — Agrupamentos funcionais**
> "Quais são os grupos de funcionalidade dentro desta área?
> Para cada grupo: nome e uma linha do que engloba.
> Pense em termos do que o usuário faz, não de como o sistema funciona."

**Pergunta 3 — Regras que valem para tudo nesta área**
> "Existe alguma regra de negócio que se aplica a tudo dentro desta área?
> Exemplos: 'qualquer ação exige aprovação de um gerente',
> 'dados desta área são visíveis apenas para o time de vendas'."

**Pergunta 4 — Relação com outras áreas**
> "Esta área depende de informações de outras áreas para funcionar?
> Outras áreas dependem desta? Descreva em linguagem de negócio."

Com as respostas, gere o artefato parcial:

📄 `modules/[dominio]/README.md` — seções negociais

Seções geradas nesta etapa:
- Responsabilidade (o que faz e o que não faz)
- Agrupamentos funcionais / Feature Sets (nome + descrição)
- Regras transversais de negócio
- Dependências com outras áreas (descrição negocial, sem FK ou joins)

Seções deixadas em branco para o PROMPT 1B:
- Entidades e campos
- Integrações técnicas
- Endpoints consolidados
- Códigos de erro

Após apresentar, pergunte:
> "O N1 negocial de [domínio] está correto?
> Ajusta algo ou avanço para o próximo domínio?"

---

### PASSO 3 — INDEX negocial

Após todos os domínios aprovados, gere:

📄 `modules/INDEX.md` — versão negocial

Conteúdo:
- Tabela de domínios com nome, responsabilidade e Feature Sets
- Mapa de dependências entre domínios em linguagem de negócio
- Lista de regras que cruzam mais de um domínio

Ao apresentar, informe:
> "Parte negocial do N1 concluída. Para complementar com os campos,
> entidades e integrações técnicas, use o PROMPT 1B passando
> cada README.md gerado aqui como contexto."

---
---

## PROMPT 1B — N1 Técnico
### Domínios do sistema · Parte técnica
> **Quem participa**: dev
> **Insumo necessário**: README.md negocial gerado pelo PROMPT 1A (aprovado pelo PO)
> **Entrega**: README.md completo com entidades, campos mapeados,
> integrações técnicas, endpoints e códigos de erro consolidados

---

### INSTRUÇÕES PARA O CLAUDE

Você vai complementar o N1 negocial com as definições técnicas do domínio.
O conteúdo negocial já foi validado pelo PO e não deve ser alterado —
apenas complementado com as seções técnicas.

Regras da sessão:
- Trabalhe um domínio de cada vez, na ordem que eu indicar.
- Ao completar as perguntas de um domínio, apresente as seções técnicas
  geradas e aguarde aprovação antes de gerar o arquivo final mesclado.
- Sinalize suposições com ⚠️.
- Cruze os campos informados com o DATA-MODEL.md — campos já existentes
  usam os nomes de lá; campos novos são propostos com ⚠️.

---

### CONTEXTO DO PROJETO

=== MASTER.md ===
[cole aqui o conteúdo do MASTER.md]

=== DATA-MODEL.md ===
[cole aqui o conteúdo do DATA-MODEL.md]

=== API-PATTERNS.md ===
[cole aqui o conteúdo do API-PATTERNS.md]

=== N1 NEGOCIAL DO DOMÍNIO (gerado pelo PROMPT 1A) ===
[cole aqui o README.md negocial do domínio a ser complementado]

---

### PASSO 1 — Entidades e campos

Faça as perguntas abaixo em sequência:

**Pergunta 1 — Entidades**
> "Quais tabelas do banco de dados pertencem a este domínio?
> Liste cada uma com uma linha de descrição."

**Pergunta 2 — Campos de cada entidade**
> Para cada entidade identificada, pergunte:
> "Para a entidade [nome], liste os campos que você conhece.
> Para cada campo: Label PO (português), tipo de dado
> e se é obrigatório ou automático."

Após receber os campos:
- Cruze com o DATA-MODEL.md
- Para campos já existentes: confirme Label Dev e campo banco
- Para campos novos: proponha Label Dev (camelCase) e campo banco
  (snake_case) seguindo a convenção do MASTER.md, sinalizando com ⚠️

---

### PASSO 2 — Integrações técnicas

**Pergunta 3 — Dependências externas**
> "Este domínio chama algum serviço externo?
> Para cada um: nome do serviço, para que é usado e lib sugerida."

**Pergunta 4 — Integrações entre domínios**
> "Quais tabelas deste domínio são referenciadas por outros domínios?
> Quais tabelas de outros domínios este domínio referencia?
> Como é feita essa integração — FK, evento ou chamada de serviço?"

---

### PASSO 3 — Consolidação técnica

Com as respostas, gere as seções técnicas:

- Entidades (tabela completa: Label PO | Label Dev | Campo banco | Tipo | Obrigatório | Notas)
- Dependências externas (tabela: serviço, uso, lib)
- Integrações com outros domínios (leitura e escrita separadas)
- Eventos publicados e consumidos
- Endpoints consolidados do domínio (preliminar; será detalhado nos N3)
- Códigos de erro do domínio (preliminar)

Apresente apenas as seções técnicas (não repetir as negociais).
Pergunte:
> "As seções técnicas do N1 de [domínio] estão corretas?
> Posso gerar o arquivo final mesclado?"

Após aprovação, gere o arquivo completo:

📄 `modules/[dominio]/README.md` — versão completa (negócio + técnico)

Aplique a marcação de visibilidade:
- Seções negociais: visíveis para todos
- Seções técnicas: dentro de `<div class="dev-only">`

---
---
---

# NÍVEL 2

---

## PROMPT 2A — N2 Negócio
### Feature Sets · Parte negocial
> **Quem participa**: PO + dev (ou só PO)
> **Insumo necessário**: N1 completo do domínio escolhido
> **Entrega**: rascunho do README.md de cada Feature Set com fluxo principal,
> telas e permissões — sem campos técnicos ou endpoints

---

### INSTRUÇÕES PARA O CLAUDE

Você vai detalhar os Feature Sets de um domínio do ponto de vista de negócio.
Foque em fluxos, jornadas e regras — sem mencionar endpoints, FKs ou libs.

Regras da sessão:
- Trabalhe um Feature Set de cada vez, na ordem que eu indicar.
- Ao completar as perguntas, gere o artefato parcial e aguarde aprovação.
- Sinalize suposições com ⚠️.

---

### CONTEXTO DO PROJETO

=== MASTER.md ===
[cole aqui o conteúdo do MASTER.md]

=== N1 DO DOMÍNIO ESCOLHIDO ===
[cole aqui o README.md completo do domínio]

---

### PASSO 1 — Confirmação dos Feature Sets

Leia o N1 e liste os Feature Sets identificados. Pergunte:
> "Identifiquei os seguintes Feature Sets no domínio [nome]: [lista].
> Qual deles deseja detalhar primeiro?"

---

### PASSO 2 — Detalhamento negocial de cada Feature Set

Para cada Feature Set que eu indicar, faça as perguntas abaixo
em sequência, uma de cada vez:

**Pergunta 1 — Features**
> "Quais são as funcionalidades individuais deste grupo?
> Para cada uma: nome e uma linha do que o usuário consegue fazer."

**Pergunta 2 — Jornada principal**
> "Descreva a jornada principal do usuário dentro deste grupo,
> do início ao fim, em linguagem natural.
> O que ele faz primeiro? O que acontece depois? Como termina?"

**Pergunta 3 — Dependências entre funcionalidades**
> "Alguma funcionalidade depende de outra para existir ou funcionar?
> Existe alguma ordem obrigatória ou exclusão mútua entre elas?"

**Pergunta 4 — Telas**
> "Quais telas o usuário vai ver neste grupo de funcionalidades?
> Para cada tela: nome, o que ela mostra e quais funcionalidades ela atende."

**Pergunta 5 — Permissões**
> "Quem pode usar este grupo de funcionalidades?
> Existem diferenças de acesso entre perfis de usuário?
> Descreva em linguagem de negócio (sem mencionar roles técnicas)."

Com as respostas, gere o artefato parcial:

📄 `modules/[dominio]/[feature-set]/README.md` — seções negociais

Seções geradas nesta etapa:
- Responsabilidade (o que faz e o que não faz)
- Features (tabela: nome, arquivo N3, descrição)
- Fluxo principal (diagrama em texto ou lista numerada)
- Dependências entre features
- Telas (tabela: nome, rota, features atendidas)
- Permissões por perfil (descrição negocial)

Seções deixadas em branco para o PROMPT 2B:
- Campos consolidados do Feature Set
- Endpoints
- Códigos de erro
- Eventos

Após apresentar, pergunte:
> "O N2 negocial de [Feature Set] está correto?
> Ajusta algo ou avanço para o próximo Feature Set?"

---

### PASSO 3 — Confirmação de cobertura

Após todos os Feature Sets do domínio aprovados, confirme:
> "Todos os Feature Sets do domínio [nome] foram detalhados.
> Para complementar com campos, endpoints e eventos,
> use o PROMPT 2B passando cada README.md gerado aqui como contexto."

---
---

## PROMPT 2B — N2 Técnico
### Feature Sets · Parte técnica
> **Quem participa**: dev
> **Insumo necessário**: README.md negocial do Feature Set (gerado pelo PROMPT 2A)
> **Entrega**: README.md completo com campos consolidados, endpoints,
> eventos e códigos de erro do Feature Set

---

### INSTRUÇÕES PARA O CLAUDE

Você vai complementar o N2 negocial com as definições técnicas do Feature Set.
O conteúdo negocial já foi validado e não deve ser alterado — apenas complementado.

Regras da sessão:
- Trabalhe um Feature Set de cada vez.
- Cruze os campos com o DATA-MODEL.md e com os N3 já existentes do Feature Set,
  se houver. Para campos novos, proponha com ⚠️.
- Sinalize suposições com ⚠️.

---

### CONTEXTO DO PROJETO

=== MASTER.md ===
[cole aqui o conteúdo do MASTER.md]

=== DATA-MODEL.md ===
[cole aqui o conteúdo do DATA-MODEL.md]

=== API-PATTERNS.md ===
[cole aqui o conteúdo do API-PATTERNS.md]

=== N1 DO DOMÍNIO ===
[cole aqui o README.md completo do domínio]

=== N2 NEGOCIAL DO FEATURE SET (gerado pelo PROMPT 2A) ===
[cole aqui o README.md negocial do Feature Set a ser complementado]

=== N3 JÁ EXISTENTES DO FEATURE SET (se houver) ===
[cole aqui os N3 já gerados das features deste Feature Set]

---

### PASSO 1 — Campos consolidados

**Pergunta 1**
> "Quais campos são manipulados pelas features deste Feature Set?
> Liste todos que você conhece — podem ser incompletos."

Após receber:
- Cruze com o DATA-MODEL.md e com os N3 existentes
- Monte a tabela consolidada: Label PO | Label Dev | Campo banco | Tipo | Feature(s)
- Sinalize campos novos com ⚠️

---

### PASSO 2 — Endpoints, eventos e erros

**Pergunta 2 — Endpoints**
> "Quais operações de API este Feature Set vai expor?
> Para cada uma: o que faz, qual recurso afeta e qual tipo de operação é
> (consulta, criação, alteração, exclusão ou ação especial)."

Com a resposta, monte a tabela de endpoints seguindo o API-PATTERNS.md:
método | rota | feature | descrição.

**Pergunta 3 — Eventos**
> "Alguma feature deste Feature Set gera notificações ou dispara
> ações em outras partes do sistema? Quais?"

Com a resposta, monte a tabela de eventos: evento | tipo | feature | consumidores.

**Pergunta 4 — Erros específicos**
> "Quais erros específicos podem ocorrer nas features deste Feature Set
> e que não estão cobertos pelos erros globais do API-PATTERNS.md?"

Com a resposta, monte a tabela de erros: código | HTTP | feature | situação.

---

### PASSO 3 — Geração do arquivo final

Apresente as seções técnicas geradas (sem repetir as negociais).
Pergunte:
> "As seções técnicas do N2 de [Feature Set] estão corretas?
> Posso gerar o arquivo final mesclado?"

Após aprovação, gere o arquivo completo:

📄 `modules/[dominio]/[feature-set]/README.md` — versão completa

Aplique a marcação de visibilidade:
- Seções negociais: visíveis para todos
- Seções técnicas: dentro de `<div class="dev-only">`

---
---
---

# NÍVEL 3

---

## PROMPT 3A — N3 Negócio
### Features · Parte negocial
> **Quem participa**: PO + dev (ou só PO)
> **Insumo necessário**: N1 do domínio + N2 do Feature Set escolhido
> **Entrega**: rascunho do .md de cada feature com objetivo, campos
> em linguagem de negócio, regras e cenários Gherkin negociais

---

### INSTRUÇÕES PARA O CLAUDE

Você vai especificar features do ponto de vista de negócio.
Use exclusivamente linguagem de negócio — sem mencionar endpoints,
campos de banco, libs ou arquivos de código.

Regras da sessão:
- Trabalhe uma feature de cada vez, na ordem que eu indicar.
- Apresente as perguntas em blocos temáticos, um bloco de cada vez.
- Ao completar todos os blocos, gere o artefato parcial e aguarde aprovação.
- Sinalize suposições com ⚠️.

---

### CONTEXTO DO PROJETO

=== MASTER.md ===
[cole aqui o conteúdo do MASTER.md]

=== DESIGN-SYSTEM.md ===
[cole aqui o conteúdo do DESIGN-SYSTEM.md]

=== N1 DO DOMÍNIO ===
[cole aqui o README.md do domínio]

=== N2 DO FEATURE SET ===
[cole aqui o README.md do Feature Set]

---

### PASSO 1 — Confirmação das features

Leia o N2 e liste as features identificadas. Pergunte:
> "Identifiquei as seguintes features em [Feature Set]: [lista].
> Qual delas deseja especificar primeiro?"

---

### PASSO 2 — Coleta negocial por blocos

Para cada feature que eu indicar, percorra os blocos abaixo em ordem,
apresentando um bloco de cada vez e aguardando minhas respostas.

---

#### BLOCO A — Visão geral
> 1. O que esta funcionalidade faz, em uma frase para alguém
>    que nunca viu o sistema?
> 2. Quem a aciona: um usuário interno, um usuário externo,
>    ou o próprio sistema automaticamente?

---

#### BLOCO B — Campos em linguagem de negócio
> 3. Quais informações o usuário precisa preencher ou visualizar
>    nesta funcionalidade?
>    Para cada informação: nome em português, tipo (texto, número,
>    data, lista de opções, sim/não, arquivo), se é obrigatória
>    e qualquer regra de preenchimento que o usuário precisa saber.
>
> 4. Existe alguma informação que o sistema preenche sozinho,
>    sem o usuário precisar informar? Qual e quando?

---

#### BLOCO C — Regras de negócio
> 5. Descreva o que acontece passo a passo quando tudo ocorre
>    como esperado (caminho feliz).
>
> 6. Existe alguma condição que impede ou altera o comportamento?
>    Exemplos: 'só pode ser feito uma vez por dia',
>    'requer aprovação de um gerente', 'depende de outro cadastro'.
>
> 7. Quando esta funcionalidade é concluída, o sistema faz
>    algo automaticamente em seguida?
>    Exemplos: envia um e-mail, cria uma tarefa, notifica alguém.
>
> 8. Esta ação precisa ficar registrada no histórico para auditoria?
>    Se sim, o que é importante registrar?

---

#### BLOCO D — Cenários alternativos
> 9. Quais erros o usuário pode cometer ao usar esta funcionalidade?
>    Para cada erro: o que aconteceu de errado e qual mensagem
>    deve ser exibida para o usuário?
>
> 10. Pode ocorrer algum conflito com informações já existentes
>     no sistema? O que acontece nesse caso?
>
> 11. O que acontece se um usuário sem permissão tentar
>     usar esta funcionalidade?
>
> 12. Existe alguma situação especial no sistema que muda
>     o comportamento desta funcionalidade?
>     Exemplos: cadastro arquivado, período de carência,
>     conta suspensa.

---

#### BLOCO E — Interface
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

Com as respostas de todos os blocos, gere o artefato parcial:

📄 `modules/[dominio]/[feature-set]/[feature].md` — seções negociais

Seções geradas nesta etapa:
- Objetivo
- Campos (Label PO | Tipo | Obrigatório | Validação em linguagem natural)
- Campos automáticos (Label PO | Valor | Quando)
- Regras de negócio (lista numerada, linguagem de negócio)
- Cenários Gherkin — apenas os grupos negociais:
  - Caminho feliz
  - Erros de validação
  - Conflitos com dados existentes
  - Restrições de acesso
  - Estados especiais
- Comportamento de tela (estados: loading, erro, empty, sucesso)

Seções deixadas em branco para o PROMPT 3B:
- Mapeamento de campos para banco
- Cenários Gherkin técnicos
- Endpoints
- Eventos e AuditLog
- Arquivos e dependências

Após apresentar, pergunte:
> "O N3 negocial de [feature] está correto?
> Ajusta algo ou avanço para a próxima feature?"

---

### PASSO 3 — Confirmação de cobertura

Após todas as features do Feature Set aprovadas, informe:
> "Parte negocial do N3 concluída para todas as features de [Feature Set].
> Para complementar com mapeamento técnico, endpoints e eventos,
> use o PROMPT 3B passando cada .md gerado aqui como contexto."

---
---

## PROMPT 3B — N3 Técnico
### Features · Parte técnica
> **Quem participa**: dev
> **Insumo necessário**: .md negocial da feature (gerado pelo PROMPT 3A,
> aprovado pelo PO) + N1 e N2 do contexto
> **Entrega**: .md completo com mapeamento de campos, endpoints,
> eventos, AuditLog, Gherkin técnico e arquivos

---

### INSTRUÇÕES PARA O CLAUDE

Você vai complementar o N3 negocial com as definições técnicas da feature.
O conteúdo negocial já foi validado pelo PO e não deve ser alterado.

Regras da sessão:
- Trabalhe uma feature de cada vez.
- Cruze todos os campos com o DATA-MODEL.md.
  Campos existentes: use os nomes de lá.
  Campos novos: proponha Label Dev e campo banco com ⚠️ e aguarde aprovação
  antes de continuar — esses campos precisam ser adicionados ao DATA-MODEL.md.
- Siga o API-PATTERNS.md para todos os endpoints gerados.
- Sinalize suposições com ⚠️.

---

### CONTEXTO DO PROJETO

=== MASTER.md ===
[cole aqui o conteúdo do MASTER.md]

=== DATA-MODEL.md ===
[cole aqui o conteúdo do DATA-MODEL.md]

=== API-PATTERNS.md ===
[cole aqui o conteúdo do API-PATTERNS.md]

=== N1 DO DOMÍNIO ===
[cole aqui o README.md do domínio]

=== N2 DO FEATURE SET ===
[cole aqui o README.md do Feature Set]

=== N3 NEGOCIAL DA FEATURE (gerado pelo PROMPT 3A) ===
[cole aqui o .md negocial da feature a ser complementada]

---

### PASSO 1 — Mapeamento de campos

Leia os campos do N3 negocial e para cada um:
- Identifique o Label Dev (camelCase) e o campo banco (snake_case)
  cruzando com o DATA-MODEL.md
- Para campos novos, proponha os nomes com ⚠️ e aguarde confirmação

Apresente a tabela de mapeamento:
Label PO | Label Dev | Campo banco | Tipo SQL | Notas

Aguarde aprovação de todos os campos novos antes de prosseguir.

---

### PASSO 2 — Endpoints

Com base nas regras e no fluxo descritos no N3 negocial, faça:

**Pergunta 1**
> "Quantos e quais tipos de operação esta feature realiza?
> Precisará de mais de um endpoint ou um é suficiente?"

Com a resposta e seguindo o API-PATTERNS.md, defina para cada endpoint:
- Método HTTP e rota
- Body ou query params com tipos TypeScript
- Exemplo de resposta de sucesso (JSON)
- Tabela de respostas de erro (código HTTP | code | situação)

---

### PASSO 3 — Eventos e AuditLog

**Pergunta 2**
> "A feature menciona ações automáticas ao concluir (e-mail, notificação,
> tarefa). Quais outros módulos precisam saber que esta ação ocorreu?"

Com a resposta, defina:
- Tabela de eventos publicados: evento | quando | payload | consumidores
- Tabela de eventos consumidos: evento | publicado por | reação
- Bloco de AuditLog: action, targetEntity, metadata

---

### PASSO 4 — Cenários Gherkin técnicos

Com base nos cenários negociais já existentes no N3, gere os cenários
técnicos adicionais que o dev precisa mas o PO não:
- Comportamento de cookies e headers de sessão
- Formato exato de erros HTTP (código + JSON de resposta)
- Comportamento de jobs assíncronos (status, polling)
- Race conditions relevantes

---

### PASSO 5 — Arquivos e dependências

Com base em tudo que foi definido, liste:
- Arquivos a criar ou alterar (com anotação do que cada um faz)
- Libs e serviços externos necessários
- Outros módulos ou serviços internos referenciados

---

### PASSO 6 — Geração do arquivo final

Apresente apenas as seções técnicas geradas.
Pergunte:
> "As seções técnicas do N3 de [feature] estão corretas?
> Posso gerar o arquivo final mesclado?"

Após aprovação, gere o arquivo completo:

📄 `modules/[dominio]/[feature-set]/[feature].md` — versão completa

Aplique a marcação de visibilidade:
- Seções negociais: visíveis para todos
  (Objetivo, Campos, Regras de negócio, Cenários negociais,
  Comportamento de tela)
- Seções técnicas: dentro de `<div class="dev-only">`
  (Mapeamento de campos, Cenários técnicos, Endpoints,
  Eventos, AuditLog, Arquivos, Dependências)

Ao apresentar o arquivo final, informe:
> "N3 de [feature] completo. Se campos novos foram aprovados
> durante esta sessão, atualize o DATA-MODEL.md antes de
> iniciar a próxima feature."
