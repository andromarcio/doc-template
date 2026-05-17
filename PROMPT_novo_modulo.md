# Prompt: Criação de novo módulo (N1 → N2 → N3)

> Cole este prompt inteiro no início de uma sessão com o Claude sempre que
> precisar criar um módulo novo do zero. O Claude vai conduzir você passo a passo,
> uma etapa de cada vez, aguardando suas respostas antes de prosseguir.

---

## INSTRUÇÕES PARA O CLAUDE

Você vai me ajudar a criar a especificação completa de um novo módulo do CRM,
seguindo a estrutura FDD em três níveis (N1 → N2 → N3).

Siga estas regras durante toda a sessão:

- Execute **uma etapa de cada vez** e aguarde minha resposta antes de avançar.
- Ao final de cada etapa, mostre o artefato gerado (o arquivo .md) e pergunte
  se posso prosseguir ou se há ajustes.
- Se alguma resposta minha for ambígua, faça perguntas de esclarecimento antes
  de gerar o artefato. Sinalizar suposições com ⚠️.
- Mantenha consistência com os arquivos de contexto que vou fornecer abaixo.
- Nunca avance para o próximo nível sem minha confirmação explícita.

---

## CONTEXTO DO PROJETO

Leia e siga rigorosamente estes arquivos antes de começar:

=== MASTER.md ===
[cole aqui o conteúdo do MASTER.md]

=== DESIGN-SYSTEM.md ===
[cole aqui o conteúdo do DESIGN-SYSTEM.md]

=== DATA-MODEL.md ===
[cole aqui o conteúdo do DATA-MODEL.md]

=== API-PATTERNS.md ===
[cole aqui o conteúdo do API-PATTERNS.md]

---

## ETAPA 1 de 5 — Identificação do domínio (N1)

Faça as perguntas abaixo e aguarde minhas respostas:

1. **Nome do domínio**: Como este domínio se chama? (ex: "Billing", "Reports")
2. **Responsabilidade**: Em uma frase, o que este domínio faz?
   O que ele NÃO faz (limites)?
3. **Feature Sets previstos**: Quais são os grandes agrupamentos de funcionalidade
   dentro deste domínio? Liste-os com nome e uma linha de descrição cada.
4. **Entidades principais**: Quais entidades de banco de dados pertencem a este
   domínio? Para cada uma, liste os campos que você já conhece (nome, tipo,
   se é obrigatório). Pode ser incompleto — vamos refinar no N3.
5. **Regras transversais**: Existe alguma regra que vale para todas as features
   do domínio? (ex: "todo registro exige aprovação de um admin",
   "dados são somente-leitura para agentes")
6. **Dependências externas**: Este domínio depende de algum serviço externo?
   (ex: gateway de pagamento, serviço de SMS, API de CEP)
7. **Integrações com outros domínios**: Este domínio lê ou escreve dados de
   outros domínios? Quais?

Com as respostas, gere o arquivo:
📄 `modules/[dominio]/README.md` (N1)

Ao apresentar o arquivo, pergunte: "O N1 está correto? Posso avançar para o N2?"

---

## ETAPA 2 de 5 — Detalhamento do Feature Set (N2)

Repita esta etapa para cada Feature Set identificado no N1.
Comece pelo mais importante e pergunte ao final de cada um se devo continuar
para o próximo Feature Set ou já ir para o N3 do atual.

Faça as perguntas abaixo para cada Feature Set:

1. **Nome e pasta**: Como este Feature Set se chama e qual será sua pasta?
   (ex: `billing/subscriptions/`)
2. **Features que o compõem**: Liste as features individuais deste Feature Set.
   Para cada uma: nome, arquivo .md que terá e uma linha do que faz.
3. **Fluxo principal**: Descreva a jornada principal do usuário dentro deste
   Feature Set em linguagem natural. (ex: "O usuário escolhe um plano →
   informa o cartão → confirma → recebe e-mail de confirmação")
4. **Dependências entre features**: Alguma feature depende de outra para funcionar?
   Existe alguma restrição de sequência ou exclusão mútua entre elas?
5. **Telas do Feature Set**: Quais telas fazem parte deste Feature Set?
   Para cada uma: nome da tela, rota e quais features ela atende.
6. **Permissões**: Quais roles podem acessar este Feature Set?
   Existe alguma restrição por role dentro das features?

Com as respostas, gere o arquivo:
📄 `modules/[dominio]/[feature-set]/README.md` (N2)

Ao apresentar o arquivo, pergunte: "O N2 de [Feature Set] está correto?
Avanço para o N3 das features deste Feature Set ou prefere revisar outro N2 antes?"

---

## ETAPA 3 de 5 — Especificação de cada Feature (N3)

Repita esta etapa para cada feature identificada no N2.
Pergunte uma feature de cada vez.

Faça as perguntas abaixo para cada feature:

### Bloco A — Visão geral
1. **Nome e objetivo**: O que esta feature faz, em uma frase para um PO?
2. **Quem usa**: Qual perfil de usuário aciona esta feature?
   É acessada por usuários internos, externos, ou ambos?

### Bloco B — Dados
3. **Campos do formulário/tela**: Quais campos o usuário preenche ou visualiza?
   Para cada campo: nome, tipo (texto, número, data, enum, booleano),
   se é obrigatório e qualquer regra de validação (tamanho, formato, valor mínimo).
4. **Campos calculados ou automáticos**: Existe algum campo que o sistema
   preenche automaticamente? (ex: data de criação, status inicial, valor calculado)
5. **Entidades afetadas**: Quais tabelas do banco são criadas, lidas ou alteradas?

### Bloco C — Regras de negócio
6. **Fluxo principal (caminho feliz)**: Descreva o que acontece passo a passo
   quando tudo ocorre conforme o esperado.
7. **Regras e restrições**: Existe alguma condição que bloqueia ou altera o
   comportamento? (ex: "só pode ser feito uma vez por dia",
   "requer saldo mínimo", "depende de aprovação")
8. **Ações automáticas**: A feature dispara algo em segundo plano?
   (ex: envio de e-mail, criação de tarefa, notificação, webhook)
9. **Rastreabilidade**: Esta feature precisa ser registrada no AuditLog?
   Se sim, qual evento e quais metadados?

### Bloco D — Comportamentos alternativos (para os cenários Gherkin)
10. **Casos de erro de entrada**: Quais erros de validação o usuário pode cometer?
    Para cada um: qual a mensagem exibida?
11. **Conflitos e duplicidades**: Pode ocorrer conflito com dados já existentes?
    O que acontece? (ex: e-mail duplicado, código já usado)
12. **Restrições de acesso**: O que acontece se um usuário sem permissão tentar
    executar a ação?
13. **Estados especiais**: Existe algum estado do sistema que altera o comportamento?
    (ex: registro arquivado, período de carência, conta em atraso)

### Bloco E — Interface
14. **Onde fica na tela**: Em qual rota e em qual componente esta feature aparece?
    É um formulário, modal, botão em uma lista, página própria?
15. **Estados de tela**: Como a tela se comporta durante loading, erro e
    quando não há dados (empty state)?
16. **Feedback ao usuário**: Qual mensagem de sucesso é exibida?
    Toast, página de confirmação, redirecionamento?

### Bloco F — Técnico (para a versão DEV do arquivo)
17. **Endpoints necessários**: Quais rotas de API esta feature precisa?
    Para cada uma: método HTTP, rota, o que recebe e o que retorna.
18. **Arquivos a criar ou alterar**: Quais arquivos serão tocados na implementação?
19. **Dependências**: Alguma lib, serviço externo ou outro módulo é necessário?

Com as respostas, gere dois artefatos:

📄 `modules/[dominio]/[feature-set]/[feature].md` — versão completa (DEV)
   Contém todos os blocos, com seções técnicas marcadas com `<div class="dev-only">`.

📄 Prévia da versão PO (apenas os blocos A, B resumido, C e D)
   Para validação rápida com o Product Owner antes de implementar.

Ao apresentar os arquivos, pergunte:
"O N3 de [feature] está correto e completo? Posso gerar a próxima feature?"

---

## ETAPA 4 de 5 — Revisão de consistência

Após todos os N3 de um Feature Set estarem prontos, execute esta revisão
automaticamente e me apresente o resultado:

Verifique e sinalize (✅ ok / ⚠️ atenção / ❌ problema):

- [ ] Todos os campos mencionados nos N3 estão nas entidades definidas no N1?
- [ ] Todas as features listadas no N2 têm um N3 correspondente?
- [ ] Os códigos de erro usados nos N3 seguem o padrão do MASTER.md?
- [ ] As rotas de API dos N3 não conflitam entre si dentro do domínio?
- [ ] As permissões dos N3 são consistentes com o que foi definido no N2?
- [ ] Algum campo ou regra aparece duplicado em mais de uma feature
      sem estar previsto como compartilhado?

Se houver itens ⚠️ ou ❌, apresente as correções sugeridas e aguarde aprovação
antes de atualizar os arquivos.

---

## ETAPA 5 de 5 — Geração do índice do módulo

Após a revisão, gere automaticamente:

📄 `modules/[dominio]/INDICE.md`

Com o seguinte conteúdo:
- Tabela de todos os Feature Sets e suas features, com links relativos para cada .md
- Lista de todas as entidades do domínio com seus campos (consolidado dos N3)
- Lista de todos os endpoints do domínio (consolidado dos N3)
- Lista de todas as mensagens de erro do domínio (código + mensagem)

Este arquivo serve como mapa de navegação do módulo e como referência rápida
para o dev sem precisar abrir cada N3 individualmente.

---

## PRONTO PARA COMEÇAR

Confirme que leu os arquivos de contexto e inicie a **Etapa 1**
fazendo as perguntas de identificação do domínio.
