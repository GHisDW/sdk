// ──────────────────────────────────────────────────────
// create-tenantscale-app — Smoke tests
// ──────────────────────────────────────────────────────

import { describe, it, expect } from 'vitest'
import { mkdtempSync, existsSync, readdirSync, rmSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'

describe('create-tenantscale-app', () => {
  it('scaffolds a complete project', async () => {
    const tmpDir = mkdtempSync(join(tmpdir(), 'ts-app-'))
    const { scaffold } = await import('../scaffold.js')

    await scaffold(tmpDir, 'test-app')

    // Root files
    expect(existsSync(join(tmpDir, 'package.json'))).toBe(true)
    expect(existsSync(join(tmpDir, 'pnpm-workspace.yaml'))).toBe(true)
    expect(existsSync(join(tmpDir, 'turbo.json'))).toBe(true)
    expect(existsSync(join(tmpDir, 'README.md'))).toBe(true)
    expect(existsSync(join(tmpDir, '.gitignore'))).toBe(true)
    expect(existsSync(join(tmpDir, '.env.example'))).toBe(true)

    // API files
    expect(existsSync(join(tmpDir, 'apps/api/src/index.ts'))).toBe(true)
    expect(existsSync(join(tmpDir, 'apps/api/src/db.ts'))).toBe(true)
    expect(existsSync(join(tmpDir, 'apps/api/src/routes/me.ts'))).toBe(true)
    expect(existsSync(join(tmpDir, 'apps/api/src/routes/api-keys.ts'))).toBe(true)
    expect(existsSync(join(tmpDir, 'apps/api/src/routes/team.ts'))).toBe(true)
    expect(existsSync(join(tmpDir, 'apps/api/src/routes/audit.ts'))).toBe(true)
    expect(existsSync(join(tmpDir, 'apps/api/src/routes/webhooks.ts'))).toBe(true)

    // Frontend files
    expect(existsSync(join(tmpDir, 'apps/web/package.json'))).toBe(true)
    expect(existsSync(join(tmpDir, 'apps/web/next.config.ts'))).toBe(true)
    expect(existsSync(join(tmpDir, 'apps/web/app/layout.tsx'))).toBe(true)
    expect(existsSync(join(tmpDir, 'apps/web/app/page.tsx'))).toBe(true)
    expect(existsSync(join(tmpDir, 'apps/web/app/login/page.tsx'))).toBe(true)
    expect(existsSync(join(tmpDir, 'apps/web/app/register/page.tsx'))).toBe(true)
    expect(existsSync(join(tmpDir, 'apps/web/app/dashboard/page.tsx'))).toBe(true)
    expect(existsSync(join(tmpDir, 'apps/web/app/team/page.tsx'))).toBe(true)
    expect(existsSync(join(tmpDir, 'apps/web/app/api-keys/page.tsx'))).toBe(true)
    expect(existsSync(join(tmpDir, 'apps/web/app/audit/page.tsx'))).toBe(true)
    expect(existsSync(join(tmpDir, 'apps/web/app/settings/page.tsx'))).toBe(true)
    expect(existsSync(join(tmpDir, 'apps/web/app/api/proxy/[...path]/route.ts'))).toBe(true)
    expect(existsSync(join(tmpDir, 'apps/web/components/NavBar.tsx'))).toBe(true)
    expect(existsSync(join(tmpDir, 'apps/web/components/providers.tsx'))).toBe(true)
    expect(existsSync(join(tmpDir, 'apps/web/lib/supabase.ts'))).toBe(true)
    expect(existsSync(join(tmpDir, 'apps/web/lib/utils.ts'))).toBe(true)

    // Supabase migration
    expect(existsSync(join(tmpDir, 'supabase/migrations/001_init.sql'))).toBe(true)

    // Template variable substitution
    const pkg = JSON.parse(await import('fs').then(fs => fs.readFileSync(join(tmpDir, 'package.json'), 'utf-8')))
    expect(pkg.name).toBe('test-app')

    // Cleanup
    rmSync(tmpDir, { recursive: true, force: true })
  })

  it('exports CLI entry point', async () => {
    // Verify bin entry in package.json (resolved from the package root)
    const fs = await import('fs')
    const { resolve, dirname } = await import('path')
    const { fileURLToPath } = await import('url')
    const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
    const pkg = JSON.parse(fs.readFileSync(`${root}/package.json`, 'utf-8'))
    expect(pkg.bin).toBeDefined()
    expect(pkg.bin['create-tenantscale-app']).toBe('./dist/index.js')
    expect(pkg.files).toContain('templates')
  })
})
