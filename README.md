<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/TenantScale/sdk/main/assets/logo-dark.svg">
    <img alt="TenantScale" src="https://raw.githubusercontent.com/TenantScale/sdk/main/assets/logo-light.svg" width="400">
  </picture>
</p>

<h3 align="center"><strong>Multi-tenant middleware for B2B SaaS — in minutes, not months.</strong></h3>

<p align="center">
  <a href="https://github.com/TenantScale/sdk/actions/workflows/ci.yml"><img src="https://github.com/TenantScale/sdk/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="https://www.npmjs.com/package/@tenantscale/sdk"><img src="https://img.shields.io/npm/v/@tenantscale/sdk?label=core&color=blue" alt="npm"></a>
  <a href="https://www.npmjs.com/package/@tenantscale/react"><img src="https://img.shields.io/npm/v/@tenantscale/react?label=react&color=blue" alt="npm react"></a>
  <a href="https://www.npmjs.com/package/create-tenantscale-app"><img src="https://img.shields.io/npm/v/create-tenantscale-app?label=create-app&color=blue" alt="npm create-app"></a>
  <img src="https://img.shields.io/badge/coverage-97%25-brightgreen" alt="Coverage">
  <a href="https://bundlephobia.com/package/@tenantscale/sdk"><img src="https://img.shields.io/bundlephobia/minzip/@tenantscale/sdk?label=bundle" alt="Bundle size"></a>
  <a href="https://github.com/TenantScale/sdk/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT"></a>
  <a href="https://github.com/TenantScale/sdk/blob/main/CONTRIBUTING.md"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome"></a>
  <a href="https://conventionalcommits.org"><img src="https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg" alt="Conventional Commits"></a>
  <a href="https://discord.gg/tenantscale"><img src="https://img.shields.io/badge/Discord-join-5865F2?logo=discord&logoColor=white" alt="Discord"></a>
</p>

<br>

**TenantScale** is a framework-agnostic TypeScript SDK that adds tenant isolation, API key auth, plan enforcement, rate limiting, audit logging, and billing integration to any B2B SaaS app — with just a few lines of code.

Stop hand-rolling multi-tenancy per project. Add it as middleware once, then ship.

---

## ✨ What It Does

| Capability | What It Means For Your App |
|------------|---------------------------|
| **🔐 API Key Auth** | Validate `Bearer` tokens or `x-api-key` headers against your Supabase DB. Scoped, hashed, ready. |
| **👤 Portal Sessions** | JWT-based session validation with role-based guards (`admin`, `super_admin`). |
| **🏢 Tenant Isolation** | Every request is scoped to a tenant. Cross-tenant leaks are structurally impossible. |
| **📊 Plan Enforcement** | Check limits (`max_users`, `max_api_keys`, `api_calls_per_day`) before allowing mutations. |
| **⏱ Rate Limiting** | Plan-aware daily API limits + IP-based creation throttling. Returns proper `429` with `Retry-After`. |
| **📝 Audit Logging** | Automatic audit trail on every API key auth. Explicit audit middleware for custom events. |
| **🔔 Webhooks** | Fire-and-forget event dispatch to tenant-configured endpoints with retry logic. |
| **💳 Stripe Billing** | Subscription management: checkouts, customer portal, plan sync via webhooks. |
| **🛡️ SSRF Protection** | Built-in webhook URL validation blocks private IPs, loopback, and internal hostnames. |

---

## 🚀 Quick Start

### Express

```typescript
import express from 'express'
import { TenantScale } from '@tenantscale/sdk'
import { authenticateApiKey, rateLimitByApiKey, requirePlanLimit, auditLog } from '@tenantscale/express'

const ts = new TenantScale({
  supabaseUrl: process.env.SUPABASE_URL!,
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
})

const app = express()

// Auth + rate limiting for all API routes
app.use('/api/*', authenticateApiKey({ ts }))
app.use('/api/*', rateLimitByApiKey({ ts }))

// Plan-gated endpoint
app.post('/api/tenants', authenticateApiKey({ ts }), requirePlanLimit({ ts }, 'max_tenants', 5))

// Automatic audit logging
app.post('/api/teams', authenticateApiKey({ ts }), auditLog({ ts }, {
  action: 'team.create',
  resource: 'team',
}))

app.listen(3001)
```

### Hono

```typescript
import { Hono } from 'hono'
import { TenantScale } from '@tenantscale/sdk'
import { authenticateApiKey, requirePortalSession, requirePlanLimit, errorHandler } from '@tenantscale/hono'

const ts = new TenantScale({
  supabaseUrl: process.env.SUPABASE_URL!,
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
})

const app = new Hono()

// API key auth for API routes
app.use('/api/*', authenticateApiKey({ ts }))
app.use('/api/admin/*', requirePortalSession({ ts }), requirePlanLimit({ ts }, 'max_users', 10))

// Global error handler maps SDK errors → proper HTTP status codes
app.onError(errorHandler({ ts }))
```

### Next.js (App Router)

```typescript
// app/api/tenants/route.ts
import { TenantScale } from '@tenantscale/sdk'
import { authenticateApiKey, createHandler } from '@tenantscale/next'

const ts = new TenantScale({ supabaseUrl: process.env.SUPABASE_URL!, supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY! })

export const GET = createHandler(ts, async (req, { tenant }) => {
  return Response.json({ tenantId: tenant.tenant_id, scopes: tenant.scopes })
}, { auth: authenticateApiKey })
```

### React (Client-side)

```tsx
import { TenantProvider, useTenant, useApiKeys, useTeam } from '@tenantscale/react'

function App() {
  return (
    <TenantProvider apiUrl="https://api.tenantscale.com">
      <Dashboard />
    </TenantProvider>
  )
}

function Dashboard() {
  const { tenant, loading } = useTenant()
  const { keys } = useApiKeys()
  const { members } = useTeam()

  if (loading) return <p>Loading…</p>
  return <div>Welcome, {tenant.name} — {keys.length} API keys, {members.length} team members</div>
}
```

### CLI

```bash
# Analyze existing code for multi-tenant readiness
npx @tenantscale/cli migrate --report-only

# Scaffold a new multi-tenant project
npx @tenantscale/cli init my-saas --framework hono

# Full-stack starter (Next.js + Hono + Supabase)
npx create-tenantscale-app my-saas
```

---

## 📦 Packages

All packages are **MIT-licensed** and published on npm.

| Package | Size | Description |
|---------|------|-------------|
| [`@tenantscale/sdk`](packages/sdk) | <img src="https://img.shields.io/bundlephobia/minzip/@tenantscale/sdk" alt="size"> | Framework-agnostic core — SDK class, auth, plans, rate limits, audit, webhooks, Stripe |
| [`@tenantscale/express`](packages/express) | <img src="https://img.shields.io/bundlephobia/minzip/@tenantscale/express" alt="size"> | Express middleware — `authenticateApiKey`, `requirePlanLimit`, `rateLimitByApiKey`, `auditLog` |
| [`@tenantscale/hono`](packages/hono) | <img src="https://img.shields.io/bundlephobia/minzip/@tenantscale/hono" alt="size"> | Hono middleware — same middleware API, built for Hono's context model |
| [`@tenantscale/next`](packages/next) | <img src="https://img.shields.io/bundlephobia/minzip/@tenantscale/next" alt="size"> | Next.js App Router — `authenticateApiKey`, `createHandler`, `withApiKey` |
| [`@tenantscale/react`](packages/react) | <img src="https://img.shields.io/bundlephobia/minzip/@tenantscale/react" alt="size"> | React hooks — `useTenant`, `usePlan`, `useApiKeys`, `useTeam`, `useAuditLog`, `useWebhooks` |
| [`@tenantscale/cli`](packages/cli) | <img src="https://img.shields.io/bundlephobia/minzip/@tenantscale/cli" alt="size"> | CLI — `tenantscale init` to scaffold, `tenantscale migrate` to analyze existing apps |
| [`create-tenantscale-app`](packages/create-app) | <img src="https://img.shields.io/bundlephobia/minzip/create-tenantscale-app" alt="size"> | Full-stack starter — scaffolds Next.js portal + Hono API + Supabase migrations in one command |

---

## 🧪 Demo

A working [multi-tenant help desk](demos/help-desk) shows the SDK in action:

- **Acme Corp** (Pro plan) — 1000 ticket limit, priority support, SSO
- **Globex Industries** (Free plan) — 10 ticket limit, basic features
- **Admin view** — cross-tenant visibility

```bash
git clone https://github.com/TenantScale/sdk.git
cd sdk/demos/help-desk
pnpm install && pnpm dev
```

---

## 🧩 Architecture

```
┌─────────────────────────────────────────────────┐
│                  Your App                        │
│                                                   │
│  ┌───────────────────────────────────────────┐   │
│  │     @tenantscale/express       (middleware) │   │
│  │     @tenantscale/hono          (middleware) │   │
│  │     @tenantscale/next          (handlers)  │   │
│  │     @tenantscale/react         (hooks)     │   │
│  └──────────────────┬────────────────────────┘   │
│                     │ uses                       │
│  ┌──────────────────▼────────────────────────┐   │
│  │       @tenantscale/sdk (core)              │   │
│  │                                            │   │
│  │  TenantScale.                              │   │
│  │    ├─ validateApiKey()      ← auth         │   │
│  │    ├─ validateSession()     ← sessions     │   │
│  │    ├─ plans.getPlanLimit()  ← pricing      │   │
│  │    ├─ rateLimiter.*()       ← rate limits  │   │
│  │    ├─ logAuditEvent()       ← audit trail  │   │
│  │    ├─ webhooks.dispatch()   ← events       │   │
│  │    └─ stripe.*()            ← billing      │   │
│  └──────────────────┬────────────────────────┘   │
│                     │ backed by                  │
│  ┌──────────────────▼────────────────────────┐   │
│  │          Supabase / PostgreSQL             │   │
│  │                                            │   │
│  │  tenants │ api_keys │ audit_logs           │   │
│  │  webhook_endpoints │ plans │ subscriptions │   │
│  └────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

---

## 🗺️ Roadmap

| Status | Feature |
|--------|---------|
| ✅ | Core SDK (auth, plans, rate limits, audit, webhooks, Stripe) |
| ✅ | Express adapter |
| ✅ | Hono adapter |
| ✅ | Next.js adapter |
| ✅ | React hooks |
| ✅ | CLI + create-tenantscale-app |
| 🔜 | **Fastify adapter** — [help wanted!](https://github.com/TenantScale/sdk/issues) |
| 🔜 | **Koa adapter** — [help wanted!](https://github.com/TenantScale/sdk/issues) |
| 🔜 | **Prisma adapter** — automatic tenant-scoped query guard |
| 🔜 | **Drizzle adapter** — automatic tenant-scoped query guard |
| 🔜 | **SSO / SAML** — enterprise identity provider integration |
| 🔜 | **RBAC** — custom roles per tenant |

---

## 🤝 Contributing

We'd love your help! TenantScale is built for the community and by the community.

**Ways to contribute:**
- 🐛 [Report a bug](https://github.com/TenantScale/sdk/issues/new?template=bug_report.md)
- 💡 [Request a feature](https://github.com/TenantScale/sdk/issues/new?template=feature_request.md)
- 🛠 [Pick a `good first issue`](https://github.com/TenantScale/sdk/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)
- 📖 Improve documentation or add examples
- 🌐 Add a new framework adapter (Fastify, Koa, NestJS…)

See [CONTRIBUTING.md](CONTRIBUTING.md) to get started. Every contributor is recognized.

## 💬 Community

- [Discord](https://discord.gg/tenantscale) — questions, ideas, show-and-tell
- [GitHub Discussions](https://github.com/TenantScale/sdk/discussions) — long-form Q&A
- [Twitter / X](https://x.com/tenantscale) — product updates

## 🔒 Security

Found a vulnerability? See [SECURITY.md](SECURITY.md) for our disclosure process.

## 📄 License

MIT &copy; TenantScale — see [LICENSE](LICENSE).

## ⭐ Support

If TenantScale helps you ship faster, [star the repo](https://github.com/TenantScale/sdk) and tell a friend!
