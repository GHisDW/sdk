// ──────────────────────────────────────────────────────
// @tenantscale/next — Types
// ──────────────────────────────────────────────────────

import type { TenantScale, ApiKeyInfo, PortalSessionInfo } from '@tenantscale/sdk'

// ── Next.js Adapter Options ──

export interface NextAdapterOptions {
  /** TenantScale SDK instance */
  ts: TenantScale

  /**
   * Header name for API key authentication.
   * @default 'x-api-key'
   */
  apiKeyHeader?: string

  /**
   * Header name for portal session authentication.
   * @default 'authorization'
   */
  authHeader?: string
}

// ── Route Handler Contexts ──

export interface ApiKeyContext {
  apiKey: ApiKeyInfo
  tenantId: string
}

export interface SessionContext {
  session: PortalSessionInfo
  tenantId: string | null
}

// ── Route Handler Config ──

export interface RouteHandlerConfig {
  /**
   * Authentication strategy. Required unless the route is public.
   */
  auth?: 'api-key' | 'session'

  /**
   * Optional scope(s) to require after API key auth.
   */
  scope?: string[]

  /**
   * Optional role(s) to require after session auth.
   */
  roles?: string[]

  /**
   * Optional plan limit check.
   * Pass a feature string (e.g. 'max_tenants') to check against
   * a static count, or an object with a dynamic counter function.
   */
  planLimit?: string | PlanLimitConfig
}

export interface PlanLimitConfig {
  feature: string
  getCount: (request: Request) => number | Promise<number>
}

// ── Route Params (match Next.js signature) ──

export interface RouteParams {
  params: Promise<Record<string, string>>
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
