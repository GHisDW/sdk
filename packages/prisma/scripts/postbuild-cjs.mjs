/**
 * Post-build step for the CJS output.
 *
 * The package root declares `"type": "module"`, so Node would otherwise treat
 * every `.js` file under `dist/cjs/` as ESM — silently dropping the CJS
 * `exports` assignments and returning an empty module to `require()` consumers.
 *
 * Writing a `package.json` with `{"type": "commonjs"}` into `dist/cjs/` makes
 * Node resolve those files as CommonJS, fixing the dual-package hazard.
 *
 * See https://nodejs.org/api/packages.html#dual-package-hazards
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const outDir = join(import.meta.dirname, '..', 'dist', 'cjs')
mkdirSync(outDir, { recursive: true })
writeFileSync(join(outDir, 'package.json'), JSON.stringify({ type: 'commonjs' }, null, 2) + '\n')

console.log('✔ wrote dist/cjs/package.json ({"type":"commonjs"})')
