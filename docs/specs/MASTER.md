# Contatos do Chico Vigilante — Especificação Mestre

## Stack técnica
- Frontend: Next.js 14 (App Router), TypeScript, Tailwind CSS
- Backend: Node.js + Express (ou Next.js API Routes)
- Banco: PostgreSQL com Prisma ORM
- Auth: NextAuth.js com Google Provider
- Mensageria: (definir: SendGrid, Twilio, Evolution API)

## Convenções de código
- Componentes React: PascalCase, um arquivo por componente
- Funções utilitárias: camelCase em /lib
- Rotas de API: REST, sempre retornam { data, error, meta }
- Erros: nunca lançar exceções cruas, sempre retornar { error: { code, message } }
- Validação: Zod em frontend e backend

## Padrão de pastas (Next.js)
/app
  /(auth)         → páginas protegidas
  /(public)       → páginas sem autenticação
  /api            → rotas de API
/components
  /ui             → componentes genéricos (Button, Input, Modal...)
  /[módulo]       → componentes específicos de cada módulo
/lib
  /db.ts          → instância do Prisma
  /auth.ts        → configuração NextAuth
  /validations    → schemas Zod

## Regras globais de negócio
- Todo registro tem: id (uuid), createdAt, updatedAt, deletedAt (soft delete)
- Paginação: sempre cursor-based, padrão 20 itens
- Multitenancy: toda query filtra por organizationId
- Logs de auditoria: toda ação crítica grava em AuditLog

## O que NÃO fazer
- Nunca usar any no TypeScript
- Nunca expor IDs internos do banco em URLs públicas (usar UUIDs)
- Nunca retornar senha, mesmo hasheada, em nenhuma resposta de API
