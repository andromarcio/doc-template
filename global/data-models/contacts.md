# Domínio: Contacts

#### Contact

| Label PO | Label Dev | Campo banco | Tipo SQL | Obrigatório | Notas |
|---|---|---|---|---|---|
| Nome completo | fullName | full_name | varchar(120) | sim | 2 a 120 caracteres |
| E-mail | email | email | varchar(254) | não* | Único por organização; *ver Regra 2 do N1 |
| Telefone | phone | phone | varchar(20) | não* | Formato E.164; *ver Regra 2 do N1 |
| Responsável | ownerId | owner_id | uuid | sim | FK → users.id; deve ser usuário ativo |
| Origem | contactSource | source | enum | automático | manual \| form \| import \| api |
| Tags | tags | tags | text[] | não | Máximo 20; cada tag até 30 caracteres |
| Anotações | notes | notes | text | não | Máximo 5.000 caracteres |

#### Tag

| Label PO | Label Dev | Campo banco | Tipo SQL | Obrigatório | Notas |
|---|---|---|---|---|---|
| Nome | name | name | varchar(30) | sim | Único por organização; case-insensitive |
| Cor | color | color | varchar(7) | não | Código hex; ex: #FF5733 |

#### SmartList

| Label PO | Label Dev | Campo banco | Tipo SQL | Obrigatório | Notas |
|---|---|---|---|---|---|
| Nome da lista | listName | name | varchar(120) | sim | Único por organização |
| Critérios | filters | filters | jsonb | sim | → ver segmentation/smart-lists.md: estrutura do jsonb |
| Criado por | createdBy | created_by | uuid | automático | FK → users.id |

#### ImportJob

| Label PO | Label Dev | Campo banco | Tipo SQL | Obrigatório | Notas |
|---|---|---|---|---|---|
| Status | status | status | enum | automático | pending \| processing \| done \| failed |
| Total de linhas | totalRows | total_rows | integer | automático | Total do CSV excluindo header |
| Importados | importedCount | imported_count | integer | automático | Linhas inseridas com sucesso |
| Ignorados | skippedCount | skipped_count | integer | automático | Duplicatas ignoradas |
| Erros | errorCount | error_count | integer | automático | Linhas com erro de validação |
| Chave do arquivo | fileKey | file_key | varchar | sim | Referência no storage temporário |
| Mapeamento de colunas | columnMapping | column_mapping | jsonb | sim | Colunas CSV → campos do sistema |
| Responsável padrão | defaultOwnerId | default_owner_id | uuid | sim | FK → users.id |
| Ignorar cabeçalho | skipHeader | skip_header | boolean | sim | Default: true |
| Relatório de erros | errorReport | error_report | jsonb | não | Array de { row, originalData, errors[] } |
| Criado por | createdBy | created_by | uuid | automático | FK → users.id |
