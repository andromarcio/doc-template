# PROMPT 1B — N1 Técnico
## Domínios do sistema · Parte técnica

> **Quem participa**: dev
> **Insumo necessário**: README.md negocial gerado pelo PROMPT 1A (aprovado pelo PO)
> **Entrega**: README.md completo com entidades, campos mapeados,
> integrações técnicas, endpoints e códigos de erro consolidados
>
> **Pré-requisito**: PROMPT_1A concluído e aprovado pelo PO

---

## INSTRUÇÕES PARA O CLAUDE

Você vai complementar o N1 negocial com as definições técnicas do domínio.
O conteúdo negocial já foi validado pelo PO e não deve ser alterado —
apenas complementado com as seções técnicas.

Regras da sessão:
- Trabalhe um domínio de cada vez, na ordem que eu indicar.
- Ao completar as perguntas de um domínio, apresente as seções técnicas
  geradas e aguarde aprovação antes de gerar o arquivo final mesclado.
- Sinalize suposições com ⚠️.
- Cruze os campos informados com o DATA-MODEL.md — campos já existentes
  usam os nomes de lá; campos novos são propostos com ⚠️ e só incorporados
  após minha confirmação explícita.

---

## CONTEXTO DO PROJETO

=== MASTER.md ===
[cole aqui o conteúdo do MASTER.md]

=== DATA-MODEL.md ===
[cole aqui o conteúdo do DATA-MODEL.md]

=== API-PATTERNS.md ===
[cole aqui o conteúdo do API-PATTERNS.md]

=== N1 NEGOCIAL DO DOMÍNIO (gerado pelo PROMPT 1A) ===
[cole aqui o README.md negocial do domínio a ser complementado]

---

## PASSO 1 — Entidades e campos

Faça as perguntas abaixo em sequência, uma de cada vez:

**Pergunta 1 — Entidades**
> "Quais tabelas do banco de dados pertencem a este domínio?
> Liste cada uma com uma linha de descrição."

**Pergunta 2 — Campos de cada entidade**
> Para cada entidade identificada, pergunte individualmente:
> "Para a entidade [nome], liste os campos que você conhece.
> Para cada campo: Label PO (português), tipo de dado
> e se é obrigatório ou automático."

Após receber os campos:
- Cruze com o DATA-MODEL.md
- Campos já existentes: confirme Label Dev e campo banco
- Campos novos: proponha Label Dev (camelCase) e campo banco
  seguindo a convenção do MASTER.md, sinalizando com ⚠️
- Aguarde confirmação de todos os campos novos antes de continuar

---

## PASSO 2 — Integrações técnicas

**Pergunta 3 — Dependências externas**
> "Este domínio chama algum serviço externo?
> Para cada um: nome do serviço, para que é usado e lib sugerida."

**Pergunta 4 — Integrações entre domínios**
> "Quais tabelas deste domínio são referenciadas por outros domínios?
> Quais tabelas de outros domínios este domínio referencia?
> Como é feita essa integração — FK, evento ou chamada de serviço?"

---

## PASSO 3 — Consolidação técnica

Com as respostas, gere as seções técnicas a adicionar:

- Entidades (tabela completa: Label PO | Label Dev | Campo banco | Tipo | Obrigatório | Notas)
- Dependências externas (tabela: serviço, uso, lib)
- Integrações com outros domínios (leitura e escrita separadas)
- Eventos publicados e consumidos
- Endpoints consolidados (preliminar; será detalhado nos N3)
- Códigos de erro do domínio (preliminar)
- Regras de acesso por role

Apresente apenas as seções técnicas — não repetir as negociais.
Pergunte:
> "As seções técnicas do N1 de [domínio] estão corretas?
> Posso gerar o arquivo final mesclado?"

---

## PASSO 4 — Geração do arquivo final

Após aprovação, gere o arquivo completo:

📄 `modules/[dominio]/README.md` — versão completa (negócio + técnico)

Aplique a marcação de visibilidade:
- Seções negociais: visíveis para todos
- Seções técnicas: dentro de `<div class="dev-only">`

Ao finalizar, informe:
> "N1 de [domínio] completo. Se campos novos foram aprovados,
> adicione-os ao DATA-MODEL.md antes de iniciar o próximo domínio.
> Para detalhar os Feature Sets, use o PROMPT_2A."
