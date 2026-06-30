// ──────────────────────────────────────────────────────
// API Key generation — cryptographically secure keys
// ──────────────────────────────────────────────────────

import { createHash, randomBytes } from 'node:crypto'
import type { GeneratedApiKey } from './types.js'

export const API_KEY_PREFIX = 'tk_'

/**
 * Generate a cryptographically secure API key with the `tk_` prefix.
 * Also returns the SHA-256 hash (for DB storage) and prefix (for display).
 */
export function generateApiKey(): GeneratedApiKey {
  const rawKey = `${API_KEY_PREFIX}${randomBytes(32).toString('hex')}`
  const keyHash = createHash('sha256').update(rawKey).digest('hex')
  const keyPrefix = rawKey.slice(0, 8)
  return { rawKey, keyHash, keyPrefix }
}

/**
 * Hash a raw API key for DB storage/comparison.
 */
export function hashApiKey(rawKey: string): string {
  return createHash('sha256').update(rawKey).digest('hex')
}

/**
 * Validate that a string looks like a valid API key format.
 * Checks the prefix and minimum length.
 */
export function isValidApiKeyFormat(key: string): boolean {
  return key.startsWith(API_KEY_PREFIX) && key.length > API_KEY_PREFIX.length + 10
}
