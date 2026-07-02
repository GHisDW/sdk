# Good First Issues — @tenantscale/sdk

~15 scoped, low-priority issues for OSS contributors. File them at https://github.com/TenantScale/sdk/issues/new

---

## 1. Add README.md files to all sub-packages

**Description:** None of the 8 sub-packages have their own README. When users browse a package on npm or the file tree, they see an empty page. Each should have a minimal README with install command, import example, and a brief description.

**Difficulty:** `trivial`  
**Files:** `packages/sdk/`, `packages/express/`, `packages/hono/`, `packages/next/`, `packages/react/`, `packages/cli/`, `packages/mcp/`, `packages/create-app/`  
**Acceptance criteria:** Each sub-package gains a `README.md` with install command, import/usage example, and package purpose. `create-app` and `cli` include CLI usage examples.

---

## 2. Consistent package.json fields across all packages

**Description:** Several packages are missing fields that help with npm discoverability and tooling. `mcp` has no `"repository"` field. `create-app` has no `"main"` field. Adapter packages lack `"keywords"`. None have `"bugs"` or `"homepage"`.

**Difficulty:** `trivial`  
**Files:** `packages/express/package.json`, `packages/hono/package.json`, `packages/next/package.json`, `packages/mcp/package.json`, `packages/create-app/package.json`  
**Acceptance criteria:** All 8 packages have: `"main"`, `"types"`, `"keywords"`, `"repository"`, `"bugs"`, `"homepage"`. Values should reference the TenantScale org and root SDK repo.

---

## 3. Add `"sideEffects": false` to all package.json files

**Description:** None of the 8 packages declare `"sideEffects": false`, preventing bundlers (webpack, Rollup, esbuild) from tree-shaking unused exports. This increases bundle sizes for consumers.

**Difficulty:** `trivial`  
**Files:** `packages/*/package.json`  
**Acceptance criteria:** Each package.json that has no side effects adds `"sideEffects": false`. If a file genuinely has side effects (rare), document it in the field.

---

## 4. Add tests for the MCP package

**Description:** `@tenantscale/mcp` has ~237 lines of business logic (query validation, RLS generation, endpoint suggestions) but zero tests. No `__tests__/` directory, no `"test"` script.

**Difficulty:** `easy`  
**Files:** `packages/mcp/src/index.ts`, `packages/mcp/package.json`  
**Acceptance criteria:** Add vitest config, add `"test"` script. Write tests for all 4 tool handlers (`get_tenant_schema`, `validate_tenant_query`, `generate_rls_policy`, `suggest_endpoint_structure`). Cover edge cases: malformed SQL, empty table names, unicode edge cases.

---

## 5. Add tests for create-app scaffolding logic

**Description:** `create-app` has only a single smoke test that checks imports. The core `scaffold.ts` (~100+ lines of directory creation, template rendering, package.json generation) is untested.

**Difficulty:** `easy`  
**Files:** `packages/create-app/src/scaffold.ts`, `packages/create-app/src/__tests__/smoke.test.ts`  
**Acceptance criteria:** Add tests covering: project already exists error, sanitized project names, template file generation, `.env.example` creation, directory structure verification.

---

## 6. Add Dependabot configuration

**Description:** No `.github/dependabot.yml` exists. The repo depends on 20+ direct and transitive dependencies. Automated security/version updates would reduce maintainer burden.

**Difficulty:** `trivial`  
**Files:** `.github/dependabot.yml` (new)  
**Acceptance criteria:** Add Dependabot config for pnpm with weekly updates, grouped minor/patch PRs, and `@types/*` in a separate group.

---

## 7. Add CODEOWNERS file

**Description:** No auto-reviewer assignment. PRs can linger without anyone being notified.

**Difficulty:** `trivial`  
**Files:** `.github/CODEOWNERS` (new)  
**Acceptance criteria:** Create CODEOWNERS that assigns `@TenantScale/maintainers` (or the repo owner) as default reviewer for all files.

---

## 8. Add commitlint enforcement in CI

**Description:** The repo uses commitlint + husky locally, but CI doesn't verify PR commits follow Conventional Commits. Squash-merged PRs could break convention.

**Difficulty:** `trivial`  
**Files:** `.github/workflows/ci.yml`  
**Acceptance criteria:** Add a commitlint step that runs `pnpm commitlint --from ${{ github.event.pull_request.base.sha }} --to ${{ github.event.pull_request.head.sha }}` on PRs.

---

## 9. Add Prettier format check to CI

**Description:** Prettier is configured with a `format` script, but CI doesn't verify formatting. Formatting drift accumulates across PRs.

**Difficulty:** `trivial`  
**Files:** `.github/workflows/ci.yml`  
**Acceptance criteria:** Add `pnpm format --check` step in CI that fails on unformatted files.

---

## 10. Add npm publish GitHub Actions workflow

**Description:** No automatic publish workflow. The maintainer must manually run `pnpm publish` for each release. An automated publish-on-tag workflow would streamline releases.

**Difficulty:** `easy`  
**Files:** `.github/workflows/publish.yml` (new)  
**Acceptance criteria:** Create a publish workflow triggered on git tags matching `v*`. Runs CI, builds all packages, publishes changed packages to npm via `pnpm publish -r` using `NPM_TOKEN` secret.

---

## 11. Add MIT license headers to source files

**Description:** None of the ~30 source files include an MIT license header. While the LICENSE file covers the repo, inline headers clarify reusability for downstream consumers.

**Difficulty:** `trivial`  
**Files:** `packages/*/src/**/*.ts`  
**Acceptance criteria:** Add a standard MIT license header comment to all source files (can use a script or eslint-plugin-header).

---

## 12. Standardize `prepublishOnly` scripts

**Description:** CLI uses `"prepublishOnly": "pnpm build"` but other packages use `npm run build`. `create-app` has no `prepublishOnly` at all.

**Difficulty:** `trivial`  
**Files:** `packages/cli/package.json`, `packages/create-app/package.json`  
**Acceptance criteria:** All packages use `pnpm build` in `prepublishOnly`. Add missing script to `create-app`.

---

## 13. Add CJS compatibility to package.json exports

**Description:** All packages only export ESM (`"import"` condition). No `"require"` condition exists, which may break CJS consumers or cause resolution issues in mixed ecosystems.

**Difficulty:** `easy`  
**Files:** `packages/sdk/package.json`, `packages/express/package.json`, `packages/hono/package.json`, `packages/next/package.json`, `packages/react/package.json`  
**Acceptance criteria:** Add a `"require"` export condition pointing to a CJS build, or document that the package is ESM-only and consumers must use dynamic import. Update tsconfig to output both formats if feasible.

---

## 14. Add `.env` entries to root `.gitignore`

**Description:** Root `.gitignore` covers `node_modules/`, `dist/`, `.turbo/`, coverage, etc. but doesn't include `.env` or `.env.local`. Contributors could accidentally commit secrets.

**Difficulty:** `trivial`  
**Files:** `.gitignore`  
**Acceptance criteria:** Add `.env`, `.env.local`, `.env.*.local` to the root `.gitignore`.

---

## 15. Add integration tests for Next.js adapter with App Router

**Description:** The Next.js adapter supports both Pages and App Router, but tests only cover basic import/export. No integration test runs against an actual Next.js project using `cookies()` from `next/headers`.

**Difficulty:** `medium`  
**Files:** `packages/next/src/__tests__/`, `packages/next/src/app-router.ts`  
**Acceptance criteria:** Add a test setup that creates a minimal Next.js app with the adapter configured, verifies route handler works with `cookies()`, and confirms tenant context is properly extracted from session tokens.
