// ──────────────────────────────────────────────────────
// create-tenantscale-app — Scaffolding engine
// ──────────────────────────────────────────────────────

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('..', import.meta.url))
const TEMPLATES_DIR = join(__dirname, 'templates')

/**
 * Recursively copy template files to the target directory.
 * Files/dirs prefixed with `_` are renamed to drop the underscore
 * (e.g. `_gitignore` → `.gitignore`, `_env.example` → `.env.example`).
 */
export async function scaffold(targetDir: string, projectName: string): Promise<void> {
  copyRecursive(TEMPLATES_DIR, targetDir, projectName)
}

function copyRecursive(srcDir: string, destDir: string, projectName: string) {
  const entries = readdirSync(srcDir)

  for (const entry of entries) {
    const srcPath = join(srcDir, entry)
    const destName = entry.startsWith('_') ? '.' + entry.slice(1) : entry
    const destPath = join(destDir, destName)
    const stat = statSync(srcPath)

    if (stat.isDirectory()) {
      mkdirSync(destPath, { recursive: true })
      copyRecursive(srcPath, destPath, projectName)
    } else {
      let content = readFileSync(srcPath, 'utf-8')
      // Replace template variables
      content = content.replace(/\{\{projectName\}\}/g, projectName)
      writeFileSync(destPath, content, 'utf-8')
    }
  }
}
