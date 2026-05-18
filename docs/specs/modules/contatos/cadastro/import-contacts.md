<!--
  CONVENÇÃO DE VISIBILIDADE
  ─────────────────────────────────────────────────────────────────
  Blocos marcados com <div class="dev-only"> contêm detalhes técnicos
  de implementação (API, campos de banco, eventos, dependências).

  Versão PO  → adicionar ao CSS: .dev-only { display: none; }
  Versão DEV → nenhum CSS adicional necessário
  ─────────────────────────────────────────────────────────────────
-->

# Feature: Importar Contatos
> **Nível 3** — Feature Set: Registry — Domínio: Contacts

## Objetivo
Permitir que um usuário autenticado carregue um arquivo CSV contendo múltiplos
contatos, mapeie as colunas do arquivo para os campos do sistema e importe
os registros válidos em lote, recebendo ao final um relatório com o resultado
de cada linha.

---

## Campos

### Configuração da importação (preenchidos pelo usuário)

| Label PO | Label Dev | Obrigatório | Validação |
|---|---|---|---|
| Arquivo CSV | file | sim | Extensão .csv; máximo 5 MB; encoding UTF-8 ou UTF-8 BOM |
| Responsável padrão | defaultOwnerId | sim | Usuário ativo da organização |
| Mapeamento de colunas | columnMapping | sim | Ao menos a coluna de nome deve ser mapeada |
| Ignorar primeira linha | skipHeader | não | Booleano; default true |

### Mapeamento de colunas disponíveis para o usuário

| Coluna do CSV | Campo do sistema | Obrigatório no mapeamento |
|---|---|---|
| (qualquer coluna) | Nome completo | sim |
| (qualquer coluna) | E-mail | não |
| (qualquer coluna) | Telefone | não |
| (qualquer coluna) | Tags | não |
| (qualquer coluna) | Anotações | não |
| (qualquer coluna) | Ignorar coluna | — |

### Campos preenchidos automaticamente pelo sistema

| Label PO | Label Dev | Valor |
|---|---|---|
| Origem | contactSource | `import` (fixo para todos os contatos importados) |
| Responsável | ownerId | `defaultOwnerId` definido na configuração |
| Organização | organizationId | Extraído da sessão do usuário autenticado |
| Data de criação | createdAt | Momento da inserção de cada linha |

<div class="dev-only">

### Mapeamento para o banco de dados

#### Tabela: contacts (linhas importadas com sucesso)
| Label Dev | Campo banco | Tipo | Notas |
|---|---|---|---|
| fullName | full_name | varchar(120) | |
| email | email | varchar(254) | Nullable |
| phone | phone | varchar(20) | Nullable |
| ownerId | owner_id | uuid | FK → users.id; do defaultOwnerId |
| tags | tags | text[] | Parseado da coluna mapeada; separador vírgula |
| notes | notes | text | Nullable |
| contactSource | source | enum | Fixo: 'import' |
| organizationId | organization_id | uuid | Do contexto da sessão |

#### Tabela: import_jobs
| Label Dev | Campo banco | Tipo | Notas |
|---|---|---|---|
| id | id | uuid | PK |
| organizationId | organization_id | uuid | FK → organizations.id |
| createdBy | created_by | uuid | FK → users.id |
| status | status | enum | pending \| processing \| done \| failed |
| totalRows | total_rows | integer | Total de linhas do CSV (excl. header se skipHeader) |
| importedCount | imported_count | integer | Linhas inseridas com sucesso |
| skippedCount | skipped_count | integer | Linhas ignoradas por duplicata |
| errorCount | error_count | integer | Linhas com erro de validação |
| fileKey | file_key | varchar | Chave do arquivo no storage temporário |
| columnMapping | column_mapping | jsonb | Mapeamento colunas CSV → campos sistema |
| defaultOwnerId | default_owner_id | uuid | FK → users.id |
| skipHeader | skip_header | boolean | |
| errorReport | error_report | jsonb | Array de { row, errors[] } |
| createdAt | created_at | timestamptz | |
| updatedAt | updated_at | timestamptz | |

</div>

---

## Regras de negócio

1. Apenas usuários com role **admin** ou **agent** podem realizar importações.
   Usuários com role **viewer** não têm acesso.

2. Usuários com role **agent** só podem importar contatos atribuindo
   a si mesmos como responsável padrão. O campo **Responsável padrão**
   é pré-preenchido e bloqueado para edição.

3. O arquivo deve ser um **CSV válido**, com extensão `.csv`, tamanho máximo
   de **5 MB** e encoding **UTF-8** ou **UTF-8 BOM**. Outros formatos
   (Excel, ODS, TSV) não são aceitos.

4. O mapeamento de colunas é obrigatório para ao menos a coluna de
   **Nome completo**. O usuário pode ignorar colunas que não deseja importar.

5. A importação é processada de forma **assíncrona**. Ao confirmar, o sistema
   registra um job e processa as linhas em segundo plano. O usuário pode
   fechar a tela — o job continua processando e ele é notificado ao final.

6. Cada linha do CSV é validada individualmente com as mesmas regras
   da criação manual de contatos:
   - Nome completo obrigatório (2 a 120 caracteres)
   - Ao menos e-mail ou telefone preenchido
   - E-mail em formato válido, se informado
   - Telefone no formato E.164, se informado

7. **E-mail duplicado dentro do mesmo arquivo**: se duas linhas do CSV
   tiverem o mesmo e-mail, apenas a primeira é importada. A segunda
   é registrada no relatório como ignorada por duplicata interna.

8. **E-mail já existente na organização**: linhas cujo e-mail já está
   cadastrado na organização são **ignoradas** (não atualizam o contato
   existente) e registradas no relatório como ignoradas por duplicata.

9. Linhas com erros de validação são **ignoradas e registradas** no
   relatório de erros com a indicação da linha e do problema encontrado.
   O restante das linhas válidas continua sendo processado normalmente.

10. Ao concluir, o sistema publica um evento `import.completed` com o
    resumo do job. O usuário responsável pela importação recebe uma
    notificação interna com o link para o relatório.

11. Toda importação — bem-sucedida ou não — é registrada no **histórico
    de auditoria** com o evento `contacts.imported` e o resumo dos contadores.

---

## Cenários de comportamento

```gherkin
Feature: Importar contatos via CSV

  Background:
    Given que o usuário está autenticado na organização "acme"
    And está na tela de importação de contatos

  # ── Caminho feliz ──────────────────────────────────────────────

  Scenario: Admin importa arquivo CSV válido com sucesso
    Given que o usuário autenticado tem role "admin"
    And existe um usuário ativo "Maria Silva" na organização
    And o usuário faz upload de um arquivo CSV com 3 linhas válidas:
      | nome          | email                | telefone       |
      | João Pereira  | joao@empresa.com     | +5511999990000 |
      | Ana Costa     | ana@empresa.com      |                |
      | Pedro Lima    |                      | +5521988880000 |
    When o usuário mapeia as colunas corretamente
    And seleciona "Maria Silva" como responsável padrão
    And confirma a importação
    Then o sistema registra um job de importação com status "pending"
    And exibe a mensagem: "Importação iniciada. Você será notificado ao concluir."
    And o job é processado em segundo plano
    And os 3 contatos são criados com "source" igual a "import"
    And os 3 contatos têm "Maria Silva" como responsável
    And o usuário recebe uma notificação: "Importação concluída: 3 importados, 0 ignorados, 0 erros."
    And o evento "contacts.imported" é registrado no histórico de auditoria

  Scenario: Usuário fecha a tela durante o processamento
    Given que uma importação foi iniciada com 500 linhas
    When o usuário fecha a tela de importação
    Then o job continua sendo processado em segundo plano
    And ao concluir o usuário recebe a notificação normalmente

  Scenario: Arquivo com header — primeira linha ignorada corretamente
    Given que o arquivo CSV tem uma linha de cabeçalho seguida de 2 linhas de dados
    And a opção "Ignorar primeira linha" está marcada
    When a importação é processada
    Then apenas as 2 linhas de dados são importadas
    And a linha de cabeçalho não gera erro nem contato

  # ── Erros de arquivo ───────────────────────────────────────────

  Scenario: Upload de arquivo com extensão inválida
    When o usuário tenta fazer upload de um arquivo "contatos.xlsx"
    Then o arquivo é rejeitado antes do upload
    And o sistema exibe a mensagem:
      "Apenas arquivos .csv são aceitos."

  Scenario: Upload de arquivo maior que 5 MB
    When o usuário tenta fazer upload de um arquivo CSV de 6 MB
    Then o arquivo é rejeitado antes do upload
    And o sistema exibe a mensagem:
      "O arquivo não pode exceder 5 MB."

  Scenario: Arquivo CSV com encoding inválido
    Given que o arquivo CSV está em encoding ISO-8859-1
    When o usuário faz upload do arquivo e confirma a importação
    Then o job falha durante o processamento
    And o usuário recebe a notificação:
      "Não foi possível processar o arquivo. Salve-o em UTF-8 e tente novamente."

  Scenario: Arquivo CSV vazio ou apenas com header
    When o usuário faz upload de um arquivo CSV sem linhas de dados
    And confirma a importação
    Then o job conclui imediatamente
    And o usuário recebe a notificação:
      "Importação concluída: 0 importados, 0 ignorados, 0 erros."

  # ── Erros de mapeamento ────────────────────────────────────────

  Scenario: Usuário não mapeia a coluna de nome
    When o usuário confirma a importação sem mapear a coluna de nome completo
    Then o sistema bloqueia o avanço
    And exibe a mensagem:
      "O campo Nome completo é obrigatório no mapeamento."

  Scenario: Usuário mapeia a mesma coluna do CSV para dois campos diferentes
    When o usuário seleciona a coluna "col_a" para "Nome completo" e também para "E-mail"
    Then o sistema bloqueia o avanço
    And exibe a mensagem:
      "A coluna 'col_a' não pode ser mapeada para mais de um campo."

  # ── Validação linha a linha ────────────────────────────────────

  Scenario: Arquivo com mix de linhas válidas e inválidas
    Given que o arquivo CSV tem 5 linhas:
      | linha | nome         | email            | telefone       | problema            |
      | 1     | João Pereira | joao@empresa.com | +5511999990000 | (válida)            |
      | 2     |              | ana@empresa.com  |                | nome ausente        |
      | 3     | Pedro Lima   | nao-e-email      | +5521988880000 | e-mail inválido     |
      | 4     | Sara Dias    |                  |                | sem e-mail e fone   |
      | 5     | Lucas Souza  |                  | +5511977770000 | (válida)            |
    When a importação é processada
    Then 2 contatos são importados (linhas 1 e 5)
    And 3 linhas são registradas no relatório de erros com suas respectivas mensagens
    And o usuário recebe a notificação:
      "Importação concluída: 2 importados, 0 ignorados, 3 erros. Ver relatório."

  Scenario: Linha com nome muito curto
    Given que uma linha do CSV tem o nome "A" no campo nome completo
    When a importação é processada
    Then a linha é ignorada
    And o relatório registra: "Linha 2: Nome deve ter ao menos 2 caracteres."

  # ── Duplicatas ─────────────────────────────────────────────────

  Scenario: E-mail já cadastrado na organização
    Given que já existe um contato com e-mail "joao@empresa.com" na organização
    And o CSV contém uma linha com o mesmo e-mail
    When a importação é processada
    Then a linha é ignorada sem criar nem atualizar o contato existente
    And o relatório registra: "Linha 3: E-mail já cadastrado na organização."
    And o contador de "ignorados" é incrementado (não o de "erros")

  Scenario: Duas linhas do CSV com o mesmo e-mail
    Given que o CSV contém duas linhas com o e-mail "joao@empresa.com"
    When a importação é processada
    Then apenas a primeira linha é importada
    And a segunda é registrada no relatório:
      "Linha 5: E-mail duplicado no arquivo — já importado na linha 2."
    And o contador de "ignorados" é incrementado

  # ── Restrições de acesso ───────────────────────────────────────

  Scenario: Viewer tenta acessar a importação
    Given que o usuário autenticado tem role "viewer"
    When o usuário tenta acessar a tela de importação
    Then o sistema exibe a mensagem:
      "Você não tem permissão para importar contatos."

  Scenario: Agent tenta selecionar outro usuário como responsável padrão
    Given que o usuário autenticado tem role "agent"
    When o usuário acessa a tela de importação
    Then o campo "Responsável padrão" está pré-preenchido com o próprio usuário
    And o campo está bloqueado para edição
    And o sistema exibe a mensagem informativa:
      "Agentes só podem importar contatos atribuídos a si mesmos."

  # ── Relatório de importação ────────────────────────────────────

  Scenario: Usuário acessa o relatório após a importação
    Given que uma importação foi concluída com erros
    When o usuário clica em "Ver relatório" na notificação
    Then o sistema exibe o relatório com:
      | Total de linhas processadas | número |
      | Importados com sucesso      | número |
      | Ignorados por duplicata     | número |
      | Erros de validação          | número |
    And exibe a lista de erros com número da linha e descrição do problema
    And oferece o botão "Baixar relatório de erros (.csv)"

  Scenario: Relatório de erros baixado em CSV
    Given que uma importação concluiu com 3 erros
    When o usuário clica em "Baixar relatório de erros (.csv)"
    Then o sistema gera um CSV com as colunas:
      | linha | dado_original | campo | erro |
    And o arquivo é baixado com o nome "erros_importacao_[data].csv"
```

---

## Comportamento de tela

### Fluxo em três etapas

A tela de importação é dividida em três etapas sequenciais apresentadas
em um stepper visual. O usuário não pode avançar sem concluir a etapa atual.

```
[1. Upload] → [2. Mapeamento] → [3. Confirmação]
```

**Etapa 1 — Upload**
- Área de drag-and-drop com fallback de botão "Selecionar arquivo"
- Validação de extensão e tamanho antes do upload (client-side)
- Após upload bem-sucedido: exibe nome do arquivo, tamanho e preview
  das primeiras 5 linhas em formato de tabela
- Opção "Ignorar primeira linha" com toggle; default: ativado

**Etapa 2 — Mapeamento de colunas**
- Exibe uma linha por coluna detectada no CSV
- Para cada coluna: nome da coluna (ou "Coluna 1", "Coluna 2"...) + select
  com os campos disponíveis do sistema + opção "Ignorar coluna"
- Campo "Nome completo" marcado com * (obrigatório)
- Ao selecionar um campo já mapeado em outra coluna, o select é resetado
  e exibe aviso de conflito
- Botão "Avançar" bloqueado até que "Nome completo" esteja mapeado

**Etapa 3 — Confirmação**
- Exibe resumo: nome do arquivo, total de linhas detectadas, mapeamento
  configurado e responsável padrão selecionado
- Botão "Iniciar importação" dispara o job
- Após confirmar: mensagem de feedback + link para a listagem de contatos

### Estados da tela

| Estado | Comportamento |
|---|---|
| Upload em andamento | Barra de progresso no componente de upload |
| Processando (após confirmar) | Toast informativo; usuário pode navegar livremente |
| Job concluído | Notificação interna com link para o relatório |
| Job com falha crítica (encoding) | Notificação interna com instrução de correção |
| Relatório disponível | Página `/contacts/import/:jobId` com contadores e lista de erros |

<div class="dev-only">

---

## API

### POST /api/v1/contacts/import
**Acesso**: autenticado — roles `admin` e `agent`
**Content-Type**: `multipart/form-data`

**Body**:
```typescript
{
  file: File                  // arquivo CSV; máx 5 MB
  defaultOwnerId: string      // UUID de usuário ativo
  skipHeader: boolean         // default: true
  columnMapping: {            // chave = índice da coluna (0-based)
    [columnIndex: string]: "fullName" | "email" | "phone" | "tags" | "notes" | "ignore"
  }
}
```

**Resposta de sucesso** — HTTP 202 (Accepted):
```json
{
  "data": {
    "jobId": "uuid",
    "status": "pending",
    "totalRows": 150,
    "createdAt": "2024-06-01T14:00:00Z"
  },
  "meta": null
}
```

**Respostas de erro**:

| Código HTTP | code | Situação |
|---|---|---|
| 401 | `AUTH_UNAUTHENTICATED` | Token ausente ou inválido |
| 403 | `AUTH_FORBIDDEN` | Role viewer tentando importar |
| 422 | `IMPORT_INVALID_FILE` | Extensão inválida ou arquivo corrompido |
| 422 | `IMPORT_FILE_TOO_LARGE` | Arquivo excede 5 MB |
| 422 | `IMPORT_MISSING_NAME_MAPPING` | Coluna de nome não mapeada |
| 422 | `IMPORT_DUPLICATE_MAPPING` | Mesma coluna mapeada para dois campos |
| 422 | `CONTACT_OWNER_INACTIVE` | defaultOwnerId referencia usuário desativado |
| 422 | `CONTACT_AGENT_OWNER_MISMATCH` | Agent tentou atribuir a outro usuário |

---

### GET /api/v1/contacts/import/:jobId
**Acesso**: autenticado — mesmo usuário que criou o job ou admin

**Resposta de sucesso** — HTTP 200:
```json
{
  "data": {
    "jobId": "uuid",
    "status": "done",
    "totalRows": 150,
    "importedCount": 142,
    "skippedCount": 5,
    "errorCount": 3,
    "createdAt": "2024-06-01T14:00:00Z",
    "updatedAt": "2024-06-01T14:01:30Z",
    "errorReport": [
      {
        "row": 2,
        "originalData": { "col0": "", "col1": "ana@emp.com" },
        "errors": ["Nome completo é obrigatório"]
      },
      {
        "row": 5,
        "originalData": { "col0": "Pedro", "col1": "nao-e-email" },
        "errors": ["E-mail inválido"]
      }
    ]
  },
  "meta": null
}
```

---

### GET /api/v1/contacts/import/:jobId/errors.csv
**Acesso**: autenticado — mesmo usuário que criou o job ou admin
**Resposta**: arquivo CSV com headers `linha,dado_original,campo,erro`
**Content-Type**: `text/csv`
**Content-Disposition**: `attachment; filename="erros_importacao_YYYY-MM-DD.csv"`

---

## Processamento assíncrono

O job é enfileirado após o POST e processado por um worker em background.

```typescript
// Fluxo do worker
async function processImportJob(jobId: string) {
  await updateJobStatus(jobId, 'processing')

  const job = await getJob(jobId)
  const rows = await parseCSV(job.fileKey, job.skipHeader)

  const results = { imported: 0, skipped: 0, errors: [] }
  const seenEmails = new Set<string>()

  for (const [index, row] of rows.entries()) {
    const data = mapColumns(row, job.columnMapping)
    const validation = validateContactData(data)

    if (!validation.ok) {
      results.errors.push({ row: index + 1, originalData: row, errors: validation.errors })
      continue
    }

    if (data.email) {
      if (seenEmails.has(data.email)) {
        results.skipped++
        results.errors.push({ row: index + 1, errors: [`E-mail duplicado no arquivo`] })
        continue
      }
      const exists = await contactExistsByEmail(data.email, job.organizationId)
      if (exists) {
        results.skipped++
        results.errors.push({ row: index + 1, errors: [`E-mail já cadastrado na organização`] })
        continue
      }
      seenEmails.add(data.email)
    }

    await createContact({ ...data, source: 'import', ownerId: job.defaultOwnerId })
    await publishEvent('contact.created', { contactId, source: 'import' })
    results.imported++
  }

  await updateJobStatus(jobId, 'done', results)
  await publishEvent('import.completed', { jobId, ...results })
  await logAction({ action: 'contacts.imported', metadata: results })
}
```

---

## Eventos publicados

| Evento | Quando | Payload principal |
|---|---|---|
| `contact.created` | A cada linha importada com sucesso | organizationId, contactId, source: "import" |
| `import.completed` | Ao finalizar o job | organizationId, jobId, importedCount, skippedCount, errorCount |

**Consumidores conhecidos**:
- `contact.created` → Work/Notifications (notifica responsável)
- `import.completed` → Work/Notifications (notifica usuário que iniciou a importação)

---

## AuditLog

```typescript
logAction({
  organizationId: context.organizationId,
  userId: job.createdBy,
  action: 'contacts.imported',
  targetEntity: 'ImportJob',
  targetId: job.id,
  metadata: {
    totalRows: job.totalRows,
    importedCount: results.imported,
    skippedCount: results.skipped,
    errorCount: results.errors.length,
    defaultOwnerId: job.defaultOwnerId
  }
})
```

---

## Arquivos a criar ou alterar

```
app/api/v1/contacts/import/route.ts            ← POST (inicia job)
app/api/v1/contacts/import/[jobId]/route.ts    ← GET (status e relatório)
app/api/v1/contacts/import/[jobId]/errors/route.ts ← GET (download CSV de erros)
app/(auth)/contacts/import/page.tsx            ← página de importação (stepper)
components/contacts/ImportStepper.tsx          ← stepper de 3 etapas
components/contacts/ColumnMapper.tsx           ← mapeamento de colunas
components/contacts/ImportReport.tsx           ← exibição do relatório
lib/services/import.service.ts                 ← lógica do job e processamento
lib/workers/import.worker.ts                   ← worker assíncrono
lib/validations/contact.ts                     ← reutiliza validação de Create Contact
lib/storage.ts                                 ← upload e leitura do arquivo CSV
```

---

## Dependências

- **Prisma** — escrita em `Contact` e `ImportJob`
- **csv-parse** — parsing do arquivo CSV com suporte a encodings
- **lib/storage.ts** — armazenamento temporário do arquivo durante o processamento
- **lib/audit.ts** — função `logAction`
- **lib/events.ts** — função `publishEvent`
- **lib/workers** — infraestrutura de processamento assíncrono (ex: BullMQ)

</div>

---

*Feature Set: Registry · Domínio: Contacts · Última revisão: —*
