// ──────────────────────────────────────────────────────
// @tenantscale/hono — Types
// ──────────────────────────────────────────────────────

import type { TenantScale, ApiKeyInfo, PortalSessionInfo } from '@tenantscale/sdk'

// ── Adapter Options ──

export interface HonoAdapterOptions {
  /** TenantScale SDK instance */
  ts: TenantScale

  /**
   * Context key for storing API key info.
   * @default 'apiKey'
   */
  apiKeyContextKey?: string

  /**
   * Context key for storing portal session info.
   * @default 'portalSession'
   */
  sessionContextKey?: string

  /**
   * Header name for API key authentication.
   * @default 'Authorization'
   */
  apiKeyHeader?: string

  /**
   * Header name for portal session authentication.
   * @default 'Authorization'
   */
  sessionHeader?: string
}

// ── Error Response Shape ──

export interface ErrorResponse {
  error: string
  code: string
  statusCode: number
  details?: Record<string, unknown>
}

// Re-export SDK types for convenience
export type { ApiKeyInfo, PortalSessionInfo }
