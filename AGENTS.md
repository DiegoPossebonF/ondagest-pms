# AGENTS.md — ondagest-pms

Base de conhecimento para toda sessão de agente OpenCode neste repositório.
Leia este arquivo antes de qualquer alteração.

---

## 1. Visão geral

**ondagest-pms** é um sistema de gestão (PMS) para pousada / aluguel por
temporada. Gerencia hóspedes, reservas, pagamentos, tarifas, serviços,
descontos e unidades, com calendário, mapa e relatórios. Interface em
**pt-BR**.

Stack principal:
- Next.js **15.5.29** (App Router) + React 19
- NextAuth **v5 beta.32** (estratégia JWT)
- Prisma **6.19.2** (NÃO atualizar — ver regras)
- Supabase (PostgreSQL 17 + Storage) — **Supabase Auth não é usado**
- Tailwind CSS, react-hook-form, zod, lucide-react, react-day-picker,
  next-themes, multer, lodash, @faker-js/faker
- E-mail via Resend

---

## 2. Domínio (modelos principais)

| Modelo | Significado |
|---|---|
| `Organization` | Organização/estabelecimento (multi-tenant). Tem `logoUrl`. |
| `User` | Usuário (roles: `OWNER`, `ADMIN`, `USER`), ligado a uma `Organization`. |
| `Guest` | Hóspede (nome, email, telefone, CPF, cidade, placa). |
| `UnitType` / `Unit` | Tipos de unidade e unidades (acomodações). |
| `Booking` | Reserva de uma unidade por hóspedes (check-in/out, valores). |
| `Rate` | Tarifa/valor por período ou tipo. |
| `Service` | Serviço adicional cobrado (ex.: taxa de limpeza, meia diária). |
| `Discount` | Desconto aplicado a uma reserva. |
| `Payment` | Pagamento vinculado a reserva (Pix, cartão etc.). |
| `Account` / `Session` / `VerificationToken` | Tabelas padrão do NextAuth (OAuth). |

Relacionamentos centrais: `Organization` → `Unit`/`Booking`/`User`;
`Booking` → `Guest`, `Payment`, `Service`, `Discount`.

**Multi-tenancy:** o isolamento por organização é feito nas consultas via
`src/lib/db/scopes.ts` e `src/app/actions/utils/dbWithTenant.ts` (filtram por
`organizationId`). Preserve esse padrão ao criar novas queries.

---

## 3. Ambientes

| | Produção | Desenvolvimento |
|---|---|---|
| Vercel | projeto `ondagest-pms`, team `diegopossebonfs-projects` | Preview (branch `develop`) |
| Domínio | `https://www.ondagest.com.br` | alias `…-git-develop-….vercel.app` |
| Git | branch `main` | branch `develop` |
| Supabase | projeto **`pzjkycvjhxnybnbyvjjm`** (PostgreSQL 17.6) | projeto **`gbzskelzpdlicprrnbju`** (`ondagest-dev`, Free, sa-east-1, PG 17.12) |
| Dados | reais, **nunca alterar** | cópia **sanitizada** (hóspedes anonimizados, senhas trocadas, tokens limpos) |

- O `.env` local aponta **somente para o dev**.
- Credenciais de produção ficam **apenas na Vercel** (e em backup seguro);
  nunca no repositório.
- Conexões dev: `DATABASE_URL` via pooler porta 6543 (`pgbouncer=true`);
  `DIRECT_URL` porta 5432. Host: `aws-0-sa-east-1.pooler.supabase.com`.

---

## 4. Regras e invariantes (não negociáveis)

1. **Produção é intocada.** Nenhuma escrita no banco de produção. Nenhum
   deploy para `main` sem pedido explícito.
2. **Prisma travado em 6.19.2** (versão de produção). Não atualizar
   Prisma/`@prisma/client` sem aprovação.
3. **Segredos nunca no git.** `.env`, `.env.local`, `.vercel/` são ignorados.
   Segredos vão para a Vercel (ou variáveis locais, nunca commitadas).
4. **Fluxo de mudança:** desenvolver em `develop` → validar local → validar no
   Preview → só então promover para `main` (via PR).
5. **Banco dev é sanitizado.** Não inserir dados pessoais reais no dev.
6. **Rollback:** tag `prod-baseline` em `main`. ATENÇÃO: a Vercel bloqueia
   deploys com Next antigo; rollback prático = novo commit revertendo só o
   código, mantendo as dependências atualizadas.
7. **E-mail desativado fora de produção.** `RESEND_API_KEY` no dev/preview é
   `re_dev_disabled` (nenhum e-mail real sai).

---

## 5. Autenticação (NextAuth v5)

- Estratégia `jwt`; adapter Prisma (`@auth/prisma-adapter`).
- Provedores: **Google** (com `allowDangerousEmailAccountLinking`) e
  **Credentials**.
- `src/lib/auth.config.ts`: `authorize` valida credenciais **direto no banco**
  (bcrypt); retorna apenas campos seguros (`id`, `name`, `email`, `image`,
  `role`, `organizationId`) — **nunca** o hash de senha.
- `src/lib/auth.ts`: callbacks `jwt`/`session` mapeiam `role` e
  `organizationId` para a sessão; `signIn` do Google cria `Organization` +
  `User` (role `OWNER`) se o e-mail não existir.
- `src/middleware.ts`: proteção por cookie (rotas públicas/privadas/admin),
  sem acesso ao banco.
- **Senha de desenvolvimento** (todos os 5 usuários do banco dev):
  `OndagestDev2026!`.
- Login por Google no Preview não funciona (callback do domínio de preview não
  está no Google Cloud). Em produção funciona normalmente.

---

## 6. Banco e Storage (Supabase)

- Schema **`public`** somente. **17 migrations** (Prisma). Nunca rodar
  `migrate` durante o deploy (o build só roda `prisma generate`).
- Buckets:
  - `public-media` — público, 5 MB, `image/jpeg` + `image/png` (logos/avatares).
  - `private-media` — privado, 10 MB (vouchers/comprovantes).
- O `Organization.logoUrl` no dev aponta para o bucket dev.

---

## 7. Comandos

- `npm run dev` — servidor local (porta 3000).
- `npm run build` — `prisma generate && next build`.
- `npm run lint`, `npm run start`.
- Node via **fnm**: `%APPDATA%\fnm\node-versions\v22.23.5\installation`.
- Clientes PostgreSQL (`psql`, `pg_dump`, `pg_restore`) em
  `%LOCALAPPDATA%\pgsql17\bin`.

---

## 8. Estado atual (nov/2026)

- `develop` está **4 commits à frente** de `main`:
  `07e04f7` (ambiente/lockfile/pin Prisma), `82b3868` (não expor hash),
  `258ced6` (Next 15.5.29 + NextAuth beta.32 + adapter 2.11.3), `496d770`
  (login direto no banco).
- `main` continua em `a873f08` (Next 15.5.6 vulnerável — RCE conhecida).
  **Merge para `main` adiado por decisão do usuário** (produção funcionando;
  atualizar depois).
- Ambiente dev validado: local + Preview apontando para o banco dev.
- Preview está atrás de **SSO da Vercel** (Deployment Protection padrão).

---

## 9. Gotchas de ambiente

- No PowerShell, `$pid` é variável reservada (não usar como nome de variável).
- Existe um arquivo órfão `src/middleware copy.ts` (candidato a remoção).
- Supabase **Free** pausa após ~7 dias sem atividade (dados preservados).
