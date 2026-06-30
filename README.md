# TenantScale SDK

**Framework-agnostic multi-tenant middleware for B2B SaaS APIs.**

[![CI](https://github.com/TenantScale/sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/TenantScale/sdk/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![conventional commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

Add tenant isolation, API key auth, plan enforcement, rate limiting, and audit logging to any Node.js app in minutes.

## Packages

| Package | npm | Description | Status |
|---------|-----|-------------|--------|
| [`@tenantscale/sdk`](packages/sdk) | [![npm](https://img.shields.io/badge/npm-published-blue)](https://www.npmjs.com/package/@tenantscale/sdk) | Framework-agnostic SDK core | ✅ |
| [`@tenantscale/express`](packages/express) | [![npm](https://img.shields.io/badge/npm-published-blue)](https://www.npmjs.com/package/@tenantscale/express) | Express middleware adapters | ✅ |
| [`@tenantscale/hono`](packages/hono) | [![npm](https://img.shields.io/badge/npm-published-blue)](https://www.npmjs.com/package/@tenantscale/hono) | Hono middleware adapters | ✅ |
| [`@tenantscale/next`](packages/next) | [![npm](https://img.shields.io/badge/npm-published-blue)](https://www.npmjs.com/package/@tenantscale/next) | Next.js App Router wrappers | ✅ |
| [`@tenantscale/react`](packages/react) | [![npm](https://img.shields.io/badge/npm-published-blue)](https://www.npmjs.com/package/@tenantscale/react) | React hooks — `useTenant`, `usePlan`, `useApiKeys` | ✅ |
| [`@tenantscale/cli`](packages/cli) | [![npm](https://img.shields.io/badge/npm-published-blue)](https://www.npmjs.com/package/@tenantscale/cli) | CLI tools — `init` + `migrate` | ✅ |

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

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) to get started.

- 📖 [Code of Conduct](CODE_OF_CONDUCT.md)
- 🐛 [Report a bug](https://github.com/TenantScale/sdk/issues/new?template=bug_report.md)
- 💡 [Request a feature](https://github.com/TenantScale/sdk/issues/new?template=feature_request.md)
- 🔒 [Report a vulnerability](SECURITY.md)

## License

MIT © TenantScale
