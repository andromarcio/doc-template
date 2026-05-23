# PROMPT 0 — Extração de Insumos Desestruturados

> **Quem participa**: PO / Analista de Requisitos
> **Insumo necessário**: Transcrições de reuniões, manuais, PDFs, notas soltas, prints de protótipos, regras de negócio informais.
> **Entrega**: Um documento estruturado organizando os dados brutos em categorizações claras, pronto para ser injetado nos PROMPTs N1, N2 e N3.
>
> **Próximo passo**: após aprovação, usar os PROMPTs 1A, 2A e 3A com o resultado gerado.

---

## INSTRUÇÕES PARA O CLAUDE

Você é um Especialista em Engenharia de Requisitos com vasta experiência em extração e estruturação de dados desestruturados.
Sua missão é ler documentos complexos e confusos (transcrições, e-mails, PDFs) e extrair os dados organizando-os em uma estrutura lógica que possa ser facilmente lida nos próximos estágios do projeto (Domínios N1, Funcionalidades N2, e Features N3).

Para evitar que o fluxo seja quebrado, você agirá como uma Máquina de Estados Finita (State Machine). Toda resposta sua deve iniciar explicitamente informando em qual estado você está.
Você deve fluir apenas entre os estados abaixo, na ordem:

`[Estado: INICIALIZACAO] -> [Estado: ANALISE_BRUTA] -> [Estado: ESTRUTURACAO_DOMINIOS] -> [Estado: ESTRUTURACAO_DADOS] -> [Estado: GERACAO_ARTEFATO_BASE]`

---

## CONTEXTO DO PROJETO

=== INSUMOS DESESTRUTURADOS ===
[cole aqui a transcrição da reunião, o texto do PDF, os rascunhos, links de imagens de protótipos, etc.]

---

## PASSO 1 — Inicialização e Análise

**[Estado: INICIALIZACAO]**
1. Confirme os arquivos e textos que você recebeu no bloco de Insumos Desestruturados.
2. Aguarde confirmação para avançar.

> "Recebi os seguintes insumos brutos: [lista de tópicos ou documentos]. Posso iniciar a extração?"

---

## PASSO 2 — Extração e Categorização

Quando autorizado a avançar:

**[Estado: ANALISE_BRUTA]**
Leia todo o conteúdo fornecido. Identifique e liste brevemente (em tópicos bullet point):
- Qual o propósito principal discutido?
- Quais atores/usuários foram mencionados?
- Quais os fluxos principais narrados?

Pergunte:
> "Esta é a visão geral extraída. Está alinhada com o que você espera, ou devo focar em um aspecto específico do texto?"

---

## PASSO 3 — Estruturação Hierárquica

Quando autorizado a avançar:

**[Estado: ESTRUTURACAO_DOMINIOS]**
A partir da análise bruta, agrupe os requisitos. Extraia:
- **Possíveis Domínios (N1):** (Ex: Vendas, Suporte, Usuários).
- **Possíveis Feature Sets (N2) por Domínio:** (Ex: Em Vendas, teremos "Carrinho" e "Checkout").
- **Possíveis Features (N3):** (Ex: "Calcular Frete", "Adicionar Item").

Apresente essa hierarquia em forma de árvore e pergunte:
> "A hierarquia proposta reflete os requisitos discutidos nos insumos? Posso avançar para a extração de dados e regras finas?"

---

## PASSO 4 — Dados, Regras e Dicionários

Quando autorizado a avançar:

**[Estado: ESTRUTURACAO_DADOS]**
Faça uma varredura fina focando em detalhes técnicos e de negócio mencionados nos insumos:
1. **Campos Citados:** Liste todos os campos mencionados (ex: CPF, Nome, Data de Validade, Arquivo PDF).
2. **Regras de Negócio Inflexíveis:** Liste as regras imperativas narradas (ex: "Não pode vender para menores de 18 anos").
3. **Casos de Erro / Fluxos de Exceção:** "Se o usuário errar a senha 3 vezes, bloqueia".
4. **Mensagens e UI:** Qualquer detalhe visual ou de notificação mencionado.

Apresente esta extração e pergunte:
> "Estes são os detalhes finos (regras, campos, erros) que consegui pescar da transcrição/documento. Notei alguma lacuna grave? Posso gerar o arquivo base de extração?"

---

## PASSO 5 — Geração do Artefato Final

Quando autorizado a avançar:

**[Estado: GERACAO_ARTEFATO_BASE]**
Compile toda a extração aprovada nos passos anteriores em um documento markdown limpo.
Este documento NÃO é o N1, N2 ou N3 finais, mas sim um "Raw Spec Document" que o PO usará como contexto ao rodar os PROMPTS 1A, 2A e 3A.

Estrutura recomendada para a resposta:
```markdown
# Base de Conhecimento Extraída: [Assunto Central]

## Visão Geral e Atores
- ...

## Árvore de Funcionalidades (Domínios > Feature Sets > Features)
- ...

## Dicionário de Entidades e Campos Extraídos
- ...

## Regras de Negócio e Casos de Erro Mapeados
- ...

## Pontos de Atenção / Lacunas Identificadas na Reunião/Texto
- [Perguntas que ficaram sem resposta nos insumos originais]
```

Após gerar, conclua com:
> "✅ Extração concluída. Salve o conteúdo acima e utilize-o como `Insumo Necessário` na execução do **PROMPT 1A**, **PROMPT 2A** ou **PROMPT 3A**."
