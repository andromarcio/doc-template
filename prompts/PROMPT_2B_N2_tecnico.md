# PROMPT 2B — N2 Técnico
## Feature Sets · Parte técnica

> **Quem participa**: dev
> **Insumo necessário**: README.md negocial do Feature Set (gerado pelo PROMPT 2A,
> aprovado pelo PO) + N1 do domínio
> **Entrega**: README.md completo com campos consolidados, endpoints,
> eventos e códigos de erro do Feature Set
>
> **Pré-requisito**: PROMPT_2A concluído e aprovado para o Feature Set escolhido

---

## INSTRUÇÕES PARA O CLAUDE

Você vai complementar o N2 negocial com as definições técnicas do Feature Set.
O conteúdo negocial já foi validado pelo PO e não deve ser alterado —
apenas complementado com as seções técnicas.

Regras da sessão:
- Trabalhe um Feature Set de cada vez.
- Cruze os campos com o DATA-MODEL.md e com os N3 já existentes do
  Feature Set, se houver. Para campos novos, proponha com ⚠️.
- Siga o API-PATTERNS.md para todos os endpoints.
- Sinalize suposições com ⚠️.

---

## CONTEXTO DO PROJETO

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
[cole aqui os N3 já gerados das features deste Feature Set, ou remova esta seção]

---

## PASSO 1 — Campos consolidados

**Pergunta 1**
> "Quais campos são manipulados pelas features deste Feature Set?
> Liste todos que você conhece — podem ser incompletos."

Após receber:
- Cruze com o DATA-MODEL.md e com os N3 existentes
- Monte a tabela consolidada: Label PO | Label Dev | Campo banco | Tipo | Feature(s)
- Sinalize campos novos com ⚠️ e aguarde confirmação antes de continuar

---

## PASSO 2 — Endpoints

**Pergunta 2**
> "Quais operações de API este Feature Set vai expor?
> Para cada uma: o que faz, qual recurso afeta e qual tipo de operação
> (consulta, criação, alteração, exclusão ou ação especial)."

Com a resposta, monte a tabela de endpoints seguindo o API-PATTERNS.md:
método | rota | feature | descrição

---

## PASSO 3 — Eventos

**Pergunta 3**
> "Alguma feature deste Feature Set gera notificações ou dispara
> ações em outras partes do sistema? Quais eventos são publicados
> e quais são consumidos?"

Com a resposta, monte a tabela de eventos:
evento | tipo (publicado/consumido) | feature | consumidores

---

## PASSO 4 — Erros específicos

**Pergunta 4**
> "Quais erros específicos podem ocorrer nas features deste Feature Set
> e que não estão cobertos pelos erros globais do API-PATTERNS.md?"

Com a resposta, monte a tabela de erros:
código | HTTP | feature | situação

---

## PASSO 5 — Geração do arquivo final

Apresente as seções técnicas geradas — sem repetir as negociais.
Pergunte:
> "As seções técnicas do N2 de [Feature Set] estão corretas?
> Posso gerar o arquivo final mesclado?"

Após aprovação, gere o arquivo completo:

📄 `modules/[dominio]/[feature-set]/README.md` — versão completa

Aplique a marcação de visibilidade:
- Seções negociais: visíveis para todos
- Seções técnicas: dentro de `<div class="dev-only">`

Ao finalizar, informe:
> "N2 de [Feature Set] completo. Para especificar as features
> individualmente, use o PROMPT_3A."
