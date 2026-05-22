# PROMPT 4B — N3 Update Técnico
## Atualização de Feature Existente · Parte técnica

> **Quem participa**: dev
> **Insumo necessário**: N3 atualizado (negocial) aprovado pelo PO + DATA-MODEL.md do Domínio + N3 original
> **Entrega**: .md completo atualizado + dados adicionados no DATA-MODEL.md
>
> **Pré-requisito**: PROMPT_4A concluído e aprovado para a feature

---

## INSTRUÇÕES PARA O CLAUDE

Você vai complementar a atualização do N3 negocial com as definições técnicas da feature. O conteúdo negocial da atualização já foi validado pelo PO e não deve ser alterado.

Regras da sessão:
- Foque nas partes técnicas afetadas pela mudança (Tabelas de endpoints, schemas JSON, eventos, permissões, etc).
- Cruze os novos campos (se houver) com o DATA-MODEL.md do domínio. Campos novos devem ir para o DATA-MODEL.md — NUNCA no N3.
- Avalie e avise explicitamente se a atualização introduz *breaking changes* (ex: tornar um campo opcional obrigatório, alterar formato de payload retornado, deletar campos usados no endpoint).
- Siga rigorosamente o API-PATTERNS.md.
- Sinalize suposições com ⚠️.

---

## CONTEXTO DO PROJETO

=== MASTER.md ===
[cole aqui o conteúdo do MASTER.md]

=== DATA-MODEL.md (DOMÍNIO ESPECÍFICO) ===
[cole aqui o conteúdo do data model fragmentado]

=== API-PATTERNS.md ===
[cole aqui o conteúdo do API-PATTERNS.md]

=== N3 ATUALIZADO (GERADO PELO 4A) ===
[cole aqui o .md negocial atualizado]

---

## PASSO 1 — Identificação de Breaking Changes

Leia as alterações do passo anterior e pergunte a si mesmo:
1. Esta mudança exige novas migrations?
2. Altera schemas de Request ou Response na API de forma incompatível?
3. Adiciona campos novos que precisam ser registrados no `DATA-MODEL.md`?

Gere um alerta e aguarde confirmação:
```
⚠️ Análise de Breaking Changes e Impacto:
- Migrations: [Sim/Não - Justificativa]
- APIs afetadas: [Listar]
- Eventos/Workers afetados: [Listar]
- Campos Novos: [Se sim, liste: Label PO, Label Dev, Campo banco, Tipo SQL]
```

Se houver campos novos, peça permissão para prosseguir:
> "Deseja que eu considere esses campos para o DATA-MODEL.md e gere a especificação técnica atualizada?"

---

## PASSO 2 — Geração do arquivo atualizado

Com a aprovação, atualize a seção `<div class="dev-only">` da feature, aplicando as mudanças necessárias (novos atributos no Gherkin técnico, novas validações no Mapeamento de erros, propriedades novas na API, etc).

Apresente apenas as seções técnicas geradas. Pergunte:
> "As seções técnicas atualizadas do N3 estão corretas? Posso gerar o arquivo final mesclado?"

---

## PASSO 3 — Ações Pós-Sessão

Ao finalizar, informe obrigatoriamente:

> "✅ Atualização do N3 concluída.
>
> **Ações obrigatórias antes de implementar:**
>
> 1. Adicionar ao `global/data-models/[dominio].md`:
> [tabela com campos novos aprovados, se houver]
>
> 2. Atualizar o CHANGELOG no repositório de documentação."
