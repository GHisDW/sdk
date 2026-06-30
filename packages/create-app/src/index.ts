#!/usr/bin/env node
// ──────────────────────────────────────────────────────
// create-tenantscale-app — CLI entry point
// ──────────────────────────────────────────────────────

import { existsSync, mkdirSync } from 'fs'
import { resolve } from 'path'
import { scaffold } from './scaffold.js'

const projectName = process.argv[2]?.replace(/[^a-z0-9_-]/gi, '-') || 'my-multi-tenant-app'
const targetDir = resolve(process.cwd(), projectName)

if (existsSync(targetDir)) {
  console.error(`\n  ✖ Directory already exists: ${projectName}`)
  console.error('  Choose a different name or delete the directory.\n')
  process.exit(1)
}

mkdirSync(targetDir, { recursive: true })

console.log(`\n  ◆  Creating TenantScale app: ${projectName}`)
console.log()

await scaffold(targetDir, projectName)

console.log(`\n  ◆  Done! Scaffolded at: ${targetDir}`)
console.log()
console.log('  Next steps:')
console.log(`    cd ${projectName}`)
console.log('    cp .env.example .env.local        # Add your Supabase credentials')
console.log('    pnpm install')
console.log('    pnpm dev')
console.log()
