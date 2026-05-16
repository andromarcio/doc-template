## Entidade: User

| Label PO (negócio)     | Label Dev (camelCase) | Campo banco (snake_case) | Tipo         | Notas                          |
|------------------------|-----------------------|--------------------------|--------------|--------------------------------|
| Nome completo          | fullName              | full_name                | varchar(120) |                                |
| Responsável            | ownerId               | owner_id                 | uuid (FK)    | → tabela users                 |
| Data de desativação    | deactivatedAt         | deleted_at               | timestamptz  | null = ativo (soft delete)     |
| Origem do contato      | contactSource         | source                   | enum         | manual,form,import,api         |
| Nível de acesso        | role                  | role                     | enum         | admin,agent,viewer             |
| Foto de perfil         | avatarUrl             | avatar_url               | text         | URL pública; atualiza no login |
