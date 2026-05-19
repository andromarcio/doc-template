# DATA-MODEL.md
> Mapa de entidades e campos do sistema. Cole em sessões que envolvam
> criação de campos novos ou mapeamento entre camadas.
> É a fonte da verdade para nomenclatura — qualquer campo novo deve
> ser aprovado e registrado aqui antes de aparecer em um N3.

---

## Convenção de nomenclatura

| Camada | Convenção | Exemplo |
|---|---|---|
| Label PO | Português, title case, sem jargão | `Nome completo` |
| Label Dev | camelCase, inglês, autoexplicativo | `fullName` |
| Campo banco | [CONVENÇÃO DA ORGANIZAÇÃO] | `full_name` |

> ⚠️ Informe aqui a convenção de nomenclatura de banco de dados
> utilizada pela sua organização antes de usar este arquivo.

---

## Campos globais (presentes em todas as tabelas)

| Label PO | Label Dev | Campo banco | Tipo | Notas |
|---|---|---|---|---|
| Identificador | id | id | uuid | PK; gerado automaticamente |
| Organização | organizationId | organization_id | uuid | FK → organizations; multitenancy |
| Data de criação | createdAt | created_at | timestamptz | Gerado automaticamente |
| Data de atualização | updatedAt | updated_at | timestamptz | Atualizado automaticamente |
| Data de exclusão | deletedAt | deleted_at | timestamptz | Null = ativo; soft delete |

---

## Entidades por domínio

<!--
  Para cada domínio e entidade, siga o modelo abaixo.
  Adicione novas entidades conforme forem sendo criadas nos N3.
  Campos novos propostos durante sessões são sinalizados com ⚠️
  e só incorporados após aprovação explícita.
-->

### [Nome do Domínio]

#### [Nome da Entidade]
[Descrição em uma linha do que esta entidade representa]

| Label PO | Label Dev | Campo banco | Tipo | Obrigatório | Notas |
|---|---|---|---|---|---|
| [campo] | [camelCase] | [snake_case] | [tipo SQL] | sim/não/auto | [observações] |

---

## Enums do sistema

<!--
  Liste todos os campos do tipo enum com seus valores possíveis.
  Isso evita inconsistências entre o que o N3 descreve e o que o banco aceita.
-->

| Enum | Campo banco | Valores aceitos | Usado em |
|---|---|---|---|
| [nome do enum] | [campo] | [valor1, valor2, valor3] | [Entidade.campo] |

---

## Relacionamentos entre entidades

<!--
  Mapa visual das relações para referência rápida.
  Mantenha atualizado conforme novos N3 forem gerados.
-->

```
[Entidade A] 1──N [Entidade B]     → [descrição da relação]
[Entidade B] N──N [Entidade C]     → [descrição da relação]
```

---

## Índices e restrições

<!--
  Documente índices não óbvios e restrições de unicidade.
  Ajuda o dev a criar as migrations corretamente.
-->

| Tabela | Campos | Tipo | Motivo |
|---|---|---|---|
| [tabela] | [campo1, campo2] | UNIQUE | [ex: e-mail único por organização] |
| [tabela] | [campo] | INDEX | [ex: buscas frequentes por status] |

---

## Campos adicionados recentemente

<!--
  Registre aqui campos novos aprovados durante sessões de N3,
  antes de atualizar as tabelas acima. Facilita a criação das migrations.
-->

| Data | Entidade | Campo banco | Tipo | Adicionado pelo N3 |
|---|---|---|---|---|
| [data] | [entidade] | [campo] | [tipo] | [link para o N3] |
