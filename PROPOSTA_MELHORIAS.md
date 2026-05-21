# Proposta de Melhorias: Repositório de Documentação e Especificação Gerada por IA

Após a análise dos templates, prompts e diretrizes globais presentes neste repositório, constata-se que a arquitetura do processo de especificação é extremamente madura, bem estruturada e define uma separação clara entre as visões de Negócio (PO) e Técnica (Dev). A centralização de dicionários (`FIELD-DICTIONARY.md`, `RULES-DICTIONARY.md` e `DATA-MODEL.md`) é uma excelente prática para manter consistência e evitar alucinações da IA.

No entanto, à medida que o sistema e a base de conhecimento crescerem, alguns gargalos operacionais e de manutenção podem surgir. Abaixo estão as propostas de melhoria organizadas por categoria:

---

## 1. Escalabilidade de Contexto (Context Window Management)

Atualmente, todos os prompts técnicos (`PROMPT_1B`, `PROMPT_2B`, `PROMPT_3B`, `PROMPT_SDD`) exigem que o usuário cole o conteúdo inteiro do `DATA-MODEL.md` e do `MASTER.md`.

**O Problema:**
À medida que o sistema cresce, o `DATA-MODEL.md` se tornará muito extenso, consumindo uma grande porção da janela de contexto da LLM (LLM Context Window). Isso não só aumenta os custos (se via API) como também pode causar o efeito *Lost in the Middle*, onde a IA "esquece" ou ignora entidades declaradas no meio do arquivo.

**Proposta de Melhoria:**
- **Fragmentação do Data Model:** Dividir o `DATA-MODEL.md` por domínios. Em vez de um arquivo único global, ter um `global/data-models/INDEX.md` e arquivos como `global/data-models/identity.md`, `global/data-models/contacts.md`.
- No momento de usar os prompts, o usuário (ou script) forneceria apenas o fragmento relevante do domínio em questão, mais um resumo das chaves estrangeiras (cross-domain).
- O mesmo raciocínio pode ser aplicado ao `API-PATTERNS.md` e `DESIGN-SYSTEM.md`, inserindo-os nos prompts apenas quando a feature realmente necessitar (ex: regras de UI no `PROMPT_3A`, regras de API no `PROMPT_3B`).

---

## 2. Fluxo de Manutenção e Atualização (Brownfield vs Greenfield)

A sequência atual de prompts (`1A`, `1B` -> `2A`, `2B` -> `3A`, `3B`) é ideal para criar módulos do zero (Greenfield). No entanto, o software passa a maior parte do seu ciclo de vida em manutenção (Brownfield).

**O Problema:**
Quando um PO precisa adicionar um novo campo a uma feature existente (ex: adicionar "Data de validade" em um contrato já especificado), não há um prompt específico para conduzir essa alteração de forma segura sem reescrever todo o N3.

**Proposta de Melhoria:**
- **Criar o `PROMPT_4A_N3_UPDATE_negocio.md` e `PROMPT_4B_N3_UPDATE_tecnico.md`:** Prompts especializados em ler um artefato N3 existente, receber a solicitação de mudança (ex: "Adicionar validação de CPF no cadastro") e gerar o *diff* ou a versão atualizada do N3, garantindo que o changelog (`CHANGELOG-template.md`) seja preenchido e o `DATA-MODEL.md` seja atualizado.
- O prompt de atualização deve validar se a alteração introduz um *breaking change* em contratos de API ou banco de dados.

---

## 3. Visão Estratégica de Produto (Nível 0 - N0)

O repositório começa a especificação no Nível 1 (Domínios).

**O Problema:**
A IA muitas vezes precisa inferir o tom, a persona do usuário e o objetivo principal do negócio para tomar decisões (como sugerir campos não mencionados ou definir fluxos felizes). Sem uma visão global, as sugestões da IA podem divergir do real objetivo do produto.

**Proposta de Melhoria:**
- **Criar o `N0_PRODUCT_VISION.md` na raiz do projeto:** Um documento conciso com o propósito geral do software, as principais personas de usuário (ex: "Administrador de Clínica", "Cliente Final", "Suporte"), principais métricas de sucesso e tom de voz do sistema.
- Incluir este arquivo no contexto inicial ou no `MASTER.md` para balizar as inferências do LLM durante as sessões de especificação de N1, N2 e N3.

---

## 4. Engenharia de Qualidade (QA) e Testes E2E

O `PROMPT_SDD.md` cobre muito bem os testes unitários e de integração no backend.

**O Problema:**
Cenários Gherkin são descritos nos N3, mas não há um artefato ou prompt para converter esses cenários em testes automatizados End-to-End (E2E) ou roteiros de testes manuais para a equipe de QA.

**Proposta de Melhoria:**
- **Criar o `PROMPT_QA.md`:** Um prompt focado no engenheiro de QA. Ele deve receber o N3 aprovado e gerar scripts de teste Playwright/Cypress/Selenium ou criar planos de teste em formato Gherkin compatível com Cucumber, com as devidas tags (`@smoke`, `@regression`).

---

## 5. Dicionário de Erros Centralizado

O `API-PATTERNS.md` define que cada N3 cria seus próprios códigos de erro (ex: `CONTACT_NOT_FOUND`).

**O Problema:**
Como cada N3 é processado de forma isolada do resto do sistema (a IA não tem o contexto de todos os N3 gerados), pode haver duplicação de códigos de erro ou nomenclaturas conflitantes ao longo do tempo.

**Proposta de Melhoria:**
- **Criar um `ERROR-DICTIONARY.md` em `/global`:** Assim como existe um dicionário para campos e regras, centralizar a fonte de verdade para erros. Isso garante que mensagens retornadas ao frontend sejam padronizadas e fáceis de internacionalizar (i18n) no futuro.

---

## 6. Otimização na Condução dos Prompts

Os prompts dependem de comandos como "Faça uma pergunta de cada vez" ou "Aguarde minha resposta antes de prosseguir".

**O Problema:**
Em interfaces de chat web (como o ChatGPT Plus ou Claude Pro), isso funciona razoavelmente bem. No entanto, LLMs frequentemente ignoram essas regras após interações longas, cuspindo todas as perguntas de uma vez e quebrando o fluxo da entrevista.

**Proposta de Melhoria:**
- Alterar o estilo de prompt para usar a técnica de **State Machine (Máquina de Estados)** explícita no System Prompt.
- Exemplo: Definir os estados `ESTADO_COLETA_VISAO`, `ESTADO_COLETA_CAMPOS`, `ESTADO_GERACAO`. O LLM deve sempre iniciar sua resposta dizendo em qual estado está. Isso reduz drasticamente a chance da IA pular etapas ou fazer múltiplas perguntas simultâneas.

---

## Resumo das Ações Recomendadas

1. **Refatorar o `DATA-MODEL.md`:** Dividir em sub-arquivos por domínio (ex: `data-models/identity.md`).
2. **Criar Prompts de Atualização (`PROMPT_4A` e `PROMPT_4B`):** Para lidar com manutenção de N3 existentes.
3. **Criar `N0_PRODUCT_VISION.md`:** Para dar contexto estratégico às inferências da IA.
4. **Criar `PROMPT_QA.md`:** Para geração de scripts/planos de testes E2E.
5. **Criar `ERROR-DICTIONARY.md`:** Para gerenciar e evitar colisão de códigos de erro de API.
6. **Aprimorar o controle de fluxo nos prompts:** Implementar o conceito de State Machine no System Prompt.
