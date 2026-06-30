# TenantScale SDK

**Framework-agnostic multi-tenant middleware for B2B SaaS APIs.**

Add tenant isolation, API key auth, plan enforcement, rate limiting, and audit logging to any Node.js app in minutes.

## Packages

| Package | Description | Status |
|---------|-------------|--------|
| `@tenantscale/core` | Framework-agnostic SDK core | ✅ |
| `@tenantscale/express` | Express middleware adapters | ✅ |
| `@tenantscale/hono` | Hono middleware adapters | ✅ |
| `@tenantscale/next` | Next.js App Router wrappers | ✅ |
| `@tenantscale/cli` | CLI tools — `init` + `migrate` | ✅ |

## Quick Start

```bash
npm install @tenantscale/sdk @tenantscale/express
```

```typescript
import { TenantScale } from '@tenantscale/sdk'
import { authenticateApiKey, auditLog } from '@tenantscale/express'

const ts = new TenantScale({
  supabaseUrl: process.env.SUPABASE_URL!,
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
})

app.use('/api', authenticateApiKey({ ts }))
app.use('/api', auditLog({ ts }))
```

## CLI

```bash
# Analyze an existing codebase for multi-tenant readiness
npx @tenantscale/cli migrate

# Scaffold a new multi-tenant project
npx @tenantscale/cli init
```

## License

MIT
