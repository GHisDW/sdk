# Contributing to TenantScale SDK

First off, thanks for taking the time to contribute! 🎉

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## What We're Looking For

TenantScale is a framework-agnostic multi-tenant middleware SDK for B2B SaaS. We welcome contributions like:

- **New framework adapters** — Fastify, Koa, NestJS, etc.
- **Database adapters** — Prisma, Drizzle, Mongoose query guards
- **Bug fixes & test improvements**
- **Documentation & examples**
- **Performance optimizations**

## Getting Started

### Prerequisites

- **Node.js** >= 20 (we recommend using [nvm](https://github.com/nvm-sh/nvm) — `.nvmrc` is included)
- **pnpm** >= 9 (install via `npm install -g pnpm` or `corepack enable && corepack prepare pnpm@latest --activate`)

### Setup

```bash
# Clone the repo
git clone https://github.com/TenantScale/sdk.git
cd sdk

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run all tests
pnpm test
```

### Project Structure

```
tenantscale-sdk/
├── packages/
│   ├── sdk/          # Framework-agnostic core (@tenantscale/sdk)
│   ├── express/      # Express.js adapter (@tenantscale/express)
│   ├── hono/         # Hono.js adapter (@tenantscale/hono)
│   ├── next/         # Next.js App Router adapter (@tenantscale/next)
│   └── cli/          # CLI tools init + migrate (@tenantscale/cli)
├── demos/
│   └── help-desk/    # Working multi-tenant demo app
├── vitest.workspace.ts
└── turbo.json
```

### Development Workflow

1. **Find an issue** — Check [issues](https://github.com/TenantScale/sdk/issues) labelled `good first issue` or `help wanted`
2. **Fork & branch** — Create a branch off `main`: `git checkout -b feat/my-feature`
3. **Make changes** — Code with tests
4. **Run tests** — `pnpm test` (or `pnpm test -- --filter=<package>` for a single package)
5. **Lint** — `pnpm lint`
6. **Commit** — Use [conventional commits](https://www.conventionalcommits.org/) (see below)
7. **Open a PR** — Target `main`

### Conventional Commits

We follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages. This allows us to auto-generate changelogs and version bumps.

```
feat: add Fastify adapter
^    ^
|    └─ description in imperative mood
|
└─ type: feat, fix, chore, docs, refactor, test, perf, ci, style
```

**Types:**
- `feat:` — A new feature
- `fix:` — A bug fix
- `docs:` — Documentation only
- `refactor:` — Code change that neither fixes a bug nor adds a feature
- `test:` — Adding or fixing tests
- `chore:` — Build process, tooling, or dependency changes
- `ci:` — CI configuration changes
- `perf:` — Performance improvements
- `style:` — Formatting, missing semicolons, etc. (no code change)

### Code Style

- **TypeScript** — Strict mode enforced via `tsconfig.base.json`
- **Formatting** — Prettier (`pnpm format` to auto-format)
- **Linting** — ESLint rules are package-scoped

## Adding a New Adapter

1. Copy the `packages/hono/` directory as a template
2. Rename the package in `package.json` to `@tenantscale/<framework>`
3. Implement the middleware interface
4. Add tests with full coverage
5. Add the workspace to `vitest.workspace.ts`
6. Submit a PR

## Pull Request Process

1. Ensure all tests pass and the build is clean
2. Update README or docs if your change affects the public API
3. Add tests for any new functionality
4. Your PR will be reviewed by a maintainer

## Getting Help

- Open a [discussion](https://github.com/TenantScale/sdk/discussions) for questions
- Tag `@TenantScale/maintainers` in your PR for review
