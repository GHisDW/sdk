// ──────────────────────────────────────────────────────
// @tenantscale/react — Shared Types
// ──────────────────────────────────────────────────────

// ── API Response Shapes ──

export interface UserProfile {
  id: string
  email: string
}

export interface TenantInfo {
  id: string
  name: string
  slug: string
  role: string
  is_super_admin: boolean
}

export interface PlanInfo {
  id: string
  name: string
  price_monthly: number
  features: Record<string, unknown>
  limits: Record<string, number | null>
}

export interface DeploymentInfo {
  mode: 'self_hosted' | 'cloud'
}

export interface MeResponse {
  user: UserProfile
  tenant: TenantInfo
  plan: PlanInfo
  deployment: DeploymentInfo
}

export interface ApiKey {
  id: string
  label: string
  key_prefix: string
  scopes: string[]
  is_active: boolean
  expires_at: string | null
  last_used_at: string | null
  created_at: string
}

export interface CreatedApiKey extends ApiKey {
  raw_key: string
}

export interface TeamMember {
  id: string
  user_id: string
  email: string
  role: string
  joined_at: string
}

export interface AuditEvent {
  id: string
  actor_id: string | null
  actor_type: string
  action: string
  resource: string
  details: Record<string, unknown> | null
  ip: string | null
  created_at: string
}

export interface Webhook {
  id: string
  url: string
  events: string[]
  description: string
  is_active: boolean
  created_at: string
}

export interface WebhookDelivery {
  id: string
  event_type: string
  url: string
  status: string
  response_status: number | null
  error_message: string | null
  duration_ms: number
  created_at: string
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  total_pages: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

// ── Hook Return Types ──

export interface UseQueryResult<T> {
  data: T | null
  error: Error | null
  isLoading: boolean
  refetch: () => Promise<void>
}

export interface UseMutationResult<TInput, TOutput> {
  execute: (input: TInput) => Promise<TOutput>
  isLoading: boolean
  error: Error | null
}

// ── Client Types ──

export interface TenantScaleReactOptions {
  /** Base URL for the TenantScale API (or BFF proxy) */
  baseUrl: string
  /** Optional custom fetch implementation (for BFF proxy patterns) */
  fetch?: typeof globalThis.fetch
  /** Function that returns an access token for auth headers */
  getAccessToken?: () => string | null
}

// ── SSH Types ──

export interface TenantSsrContext {
  user: UserProfile
  tenant: TenantInfo
  plan: PlanInfo
  deployment: DeploymentInfo
}
