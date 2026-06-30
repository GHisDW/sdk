// ──────────────────────────────────────────────────────
// Vitest Workspace — SDK + adapters tests
// ──────────────────────────────────────────────────────
import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  {
    test: {
      name: 'sdk',
      root: './packages/sdk',
      include: ['src/__tests__/**/*.test.ts'],
    },
  },
  {
    test: {
      name: 'express',
      root: './packages/express',
      include: ['src/__tests__/**/*.test.ts'],
    },
  },
  {
    test: {
      name: 'next',
      root: './packages/next',
      include: ['src/__tests__/**/*.test.ts'],
    },
  },
  {
    test: {
      name: 'hono',
      root: './packages/hono',
      include: ['src/__tests__/**/*.test.ts'],
    },
  },
  {
    test: {
      name: 'cli',
      root: './packages/cli',
      include: ['src/__tests__/**/*.test.ts'],
    },
  },
])
