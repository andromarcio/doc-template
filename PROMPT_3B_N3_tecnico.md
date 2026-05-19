# PROMPT 3B — N3 Técnico
## Features · Parte técnica

> **Quem participa**: dev
> **Insumo necessário**: .md negocial da feature (gerado pelo PROMPT 3A,
> aprovado pelo PO) + N1 do domínio + N2 do Feature Set
> **Entrega**: .md completo com mapeamento de campos, endpoints,
> eventos, AuditLog, Gherkin técnico, arquivos e rastreabilidade
>
> **Pré-requisito**: PROMPT_3A concluído e aprovado pelo PO para a feature

---

## INSTRUÇÕES PARA O CLAUDE

Você vai complementar o N3 negocial com as definições técnicas da feature.
O conteúdo negocial já foi validado pelo PO e não deve ser alterado.

Regras da sessão:
- Trabalhe uma feature de cada vez.
- No Passo 1, cruze todos os campos com o DATA-MODEL.md antes de qualquer
  outra coisa. Campos novos precisam de aprovação explícita minha antes
  de continuar — eles também devem ser adicionados ao DATA-MODEL.md.
- Siga o API-PATTERNS.md para todos os endpoints.
- Todas as seções geradas nesta sessão ficam dentro de `<div class="dev-only">`.
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
[cole aqui o README.md do domínio]

=== N2 DO FEATURE SET ===
[cole aqui o README.md do Feature Set]

=== N3 NEGOCIAL DA FEATURE (gerado pelo PROMPT 3A) ===
[cole aqui o .md negocial da feature a ser complementada]

---

## PASSO 1 — Mapeamento de campos

Leia os campos do N3 negocial e para cada um:
- Identifique o Label Dev (camelCase) e o campo banco (snake_case)
  cruzando com o DATA-MODEL.md
- Campos já existentes: use exatamente os nomes do DATA-MODEL.md
- Campos novos: proponha Label Dev e campo banco com ⚠️

Apresente a tabela de mapeamento completa:
Label PO | Label Dev | Campo banco | Tipo SQL | Notas

⚠️ **Aguarde minha aprovação de todos os campos novos antes de prosseguir.**
Campos aprovados devem ser adicionados ao DATA-MODEL.md após a sessão.

---

## PASSO 2 — Endpoints

Com base nas regras e no fluxo do N3 negocial, faça:

**Pergunta 1**
> "Quantos e quais tipos de operação esta feature realiza?
> Precisará de mais de um endpoint ou um é suficiente?
> Existe alguma operação assíncrona (job em background)?"

Com a resposta e seguindo rigorosamente o API-PATTERNS.md, defina
para cada endpoint:
- Método HTTP e rota
- Acesso (público / autenticado; quais roles)
- Body ou query params tipados em TypeScript
- Exemplo de resposta de sucesso (JSON com HTTP status)
- Tabela de respostas de erro (HTTP | code | situação)

---

## PASSO 3 — Eventos e AuditLog

**Pergunta 2**
> "O N3 negocial menciona ações automáticas ao concluir esta feature
> (e-mail, notificação, tarefa). Quais outros módulos precisam saber
> que esta ação ocorreu? Existe algum evento que esta feature consome
> de outros módulos?"

Com a resposta, defina:

**Eventos publicados**:
evento | quando | payload (campos) | consumidores conhecidos

**Eventos consumidos**:
evento | publicado por | reação desta feature

**AuditLog** (se a regra de negócio exige rastreabilidade):
```typescript
logAction({
  organizationId: context.organizationId,
  userId: context.userId,
  action: '[entidade.acao]',
  targetEntity: '[Entidade]',
  targetId: [entidade].id,
  metadata: { [campos relevantes] }
})
```

---

## PASSO 4 — Cenários Gherkin técnicos

Com base nos cenários negociais já existentes no N3, gere os cenários
técnicos adicionais que o dev precisa mas que seriam irrelevantes para o PO:

- Comportamento de cookies, headers e tokens de sessão
- Formato exato de erros HTTP (status code + estrutura JSON)
- Comportamento de jobs assíncronos (polling de status, falhas de worker)
- Race conditions relevantes para a implementação

---

## PASSO 5 — Arquivos e dependências

Com base em tudo definido nos passos anteriores, liste:

**Arquivos a criar ou alterar**:
```
[caminho/arquivo]     ← [o que faz — endpoint, componente, serviço, worker]
```

**Dependências**:
- [Lib/Serviço] — [para que é usado nesta feature]

---

## PASSO 6 — Geração do arquivo final

Apresente apenas as seções técnicas geradas — não repita as negociais.

Pergunte:
> "As seções técnicas do N3 de [feature] estão corretas?
> Posso gerar o arquivo final mesclado?"

Após aprovação, gere o arquivo completo:

📄 `modules/[dominio]/[feature-set]/[feature].md` — versão completa

Estrutura do arquivo final:
```
[comentário de visibilidade]

# Feature: [Nome]
> Nível 3 — Feature Set: X — Domínio: Y

## Objetivo                          ← negocial
## Campos                            ← negocial
## Regras de negócio                 ← negocial
## Cenários de comportamento         ← negocial (grupos negociais)
## Comportamento de tela             ← negocial

<div class="dev-only">
## Mapeamento de campos              ← técnico
## Cenários técnicos adicionais      ← técnico
## Mapeamento de erros               ← técnico
## API                               ← técnico
## Eventos                           ← técnico
## AuditLog                          ← técnico
## Arquivos a criar ou alterar       ← técnico
## Dependências                      ← técnico
</div>

## Implementação                     ← rastreabilidade (preenchido após dev)
```

Ao finalizar, informe:
> "N3 de [feature] completo.
>
> Ações necessárias antes da próxima feature:
> 1. Se campos novos foram aprovados, adicione-os ao DATA-MODEL.md
> 2. Atualize o status desta feature no modules/INDEX.md para 📋 Especificado
> 3. Após implementar, preencha a seção 'Implementação' no N3 e
>    atualize o status para ✅ Implementado"
