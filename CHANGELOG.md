# Changelog

Todas as mudanças relevantes neste projeto serão documentadas aqui.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adota [Semantic Versioning](https://semver.org/).

---

## [0.2.0] - 2025-08-19
### Adicionado
- Suporte a **multi-tenancy** (cada usuário pertence a uma organização).
- Novas relações no Prisma (`organizationId` em usuários e entidades principais).

### Alterado
- Fluxo de autenticação agora inclui `organizationId` na sessão e queries do Prisma.

### Removido
- Estrutura single-tenant antiga.

---

## [0.1.0] - 2025-08-10
### Adicionado
- Autenticação com email+senha e Google OAuth.
- Integração com Supabase (Postgres + Prisma).
- Deploy inicial no Vercel.
