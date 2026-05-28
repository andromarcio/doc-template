# Data Model: Contacts
> Fragmento do DATA-MODEL.md — cole apenas este arquivo nas sessões
> que envolvam o domínio Contacts.
>
> **ALFs deste domínio**: Contato · Importação de Contatos
> Detalhes de contagem: seção `## Arquivos Lógicos` no rodapé deste arquivo.

---

## Contact
> **ALF: Contato** · entidade principal

| Label PO | Label Dev | Campo banco | Tipo SQL | Obrigatório | Notas |
|---|---|---|---|---|---|
| Nome completo | fullName | full_name | varchar(120) | sim | 2 a 120 caracteres |
| E-mail | email | email | varchar(254) | não* | Único por organização |
| Telefone | phone | phone | varchar(20) | não* | Formato E.164 |
| Responsável | ownerId | owner_id | uuid | sim | FK → users.id; usuário ativo |
| Origem | contactSource | source | enum | automático | manual \| form \| import \| api |
| Tags | tags | tags | text[] | não | Máximo 20; cada tag até 30 chars |
| Anotações | notes | notes | text | não | Máximo 5.000 caracteres |

*E-mail e telefone não podem ser ambos vazios.

---

## Tag
> **ALF: Contato** · entidade de suporte (subgrupo de Contact)

| Label PO | Label Dev | Campo banco | Tipo SQL | Obrigatório | Notas |
|---|---|---|---|---|---|
| Nome | name | name | varchar(30) | sim | Único por organização; case-insensitive |
| Cor | color | color | varchar(7) | não | Código hex; ex: #FF5733 |

---

## SmartList
> **ALF: Contato** · entidade de suporte (subgrupo de Contact)

| Label PO | Label Dev | Campo banco | Tipo SQL | Obrigatório | Notas |
|---|---|---|---|---|---|
| Nome da lista | listName | name | varchar(120) | sim | Único por organização |
| Critérios | filters | filters | jsonb | sim | → ver segmentation/smart-lists.md |
| Criado por | createdBy | created_by | uuid | automático | FK → users.id |

---

## ImportJob
> **ALF: Importação de Contatos** · entidade principal

| Label PO | Label Dev | Campo banco | Tipo SQL | Obrigatório | Notas |
|---|---|---|---|---|---|
| Status | status | status | enum | automático | pending \| processing \| done \| failed |
| Total de linhas | totalRows | total_rows | integer | automático | |
| Importados | importedCount | imported_count | integer | automático | |
| Ignorados | skippedCount | skipped_count | integer | automático | Duplicatas |
| Erros | errorCount | error_count | integer | automático | |
| Chave do arquivo | fileKey | file_key | varchar | sim | Storage temporário |
| Mapeamento de colunas | columnMapping | column_mapping | jsonb | sim | |
| Responsável padrão | defaultOwnerId | default_owner_id | uuid | sim | FK → users.id |
| Ignorar cabeçalho | skipHeader | skip_header | boolean | sim | Default: true |
| Relatório de erros | errorReport | error_report | jsonb | não | Array de { row, errors[] } |
| Criado por | createdBy | created_by | uuid | automático | FK → users.id |

---

## Arquivos Lógicos deste domínio

> DET calculado excluindo os 5 campos globais (id, organizationId, createdAt, updatedAt, deletedAt).
> Critérios de complexidade: ver `global/SIZING.md`.

| ALF | Tipo | Entidades constituintes | RET | DET | Complexidade | PF |
|---|---|---|---|---|---|---|
| Contato | ALF | Contact (principal) · Tag (subgrupo) · SmartList (subgrupo) | 3 | 14 | Alta | 15 |
| Importação de Contatos | ALF | ImportJob (principal) | 1 | 11 | Média | 10 |

**Total deste domínio: 25 PF**

<details>
<summary>Memória de cálculo</summary>

**ALF: Contato**
- RET: 3 (Contact · Tag · SmartList são subgrupos lógicos distintos)
- DET Contact: fullName, email, phone, ownerId, source, tags, notes = 7
- DET Tag: name, color = 2
- DET SmartList: name, filters, createdBy = 3
- DET total: 12 campos de negócio + 2 FKs de relacionamento (ownerId, createdBy já contados) = **14**
- Complexidade: RET 3 × DET 14 → tabela SIZING.md → **Alta → 15 PF**

**ALF: Importação de Contatos**
- RET: 1 (ImportJob, sem subgrupos)
- DET: status, totalRows, importedCount, skippedCount, errorCount, fileKey, columnMapping, defaultOwnerId, skipHeader, errorReport, createdBy = **11**
- Complexidade: RET 1 × DET 11 → tabela SIZING.md → **Média → 10 PF**

</details>
