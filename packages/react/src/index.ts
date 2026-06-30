// ──────────────────────────────────────────────────────
// @tenantscale/react — Barrel exports
// ──────────────────────────────────────────────────────

// Provider & Context
export { TenantProvider, useTenantScale, useClient } from './context.js'
export type { TenantProviderProps } from './context.js'

// Client
export { TenantScaleClient } from './client.js'
export type { TenantScaleReactOptions } from './types.js'

// Hooks
export { useTenant } from './hooks/useTenant.js'
export type { TenantContext } from './hooks/useTenant.js'

export { usePlan } from './hooks/usePlan.js'
export { useApiKeys } from './hooks/useApiKeys.js'
export { useTeam } from './hooks/useTeam.js'
export { useAuditLog } from './hooks/useAuditLog.js'
export type { AuditLogResult } from './hooks/useAuditLog.js'
export { useWebhooks } from './hooks/useWebhooks.js'

// SSR
export { getTenantSsr, getTenantSsrFromHeaders } from './ssr.js'

// Types
export type {
  UserProfile,
  TenantInfo,
  PlanInfo,
  DeploymentInfo,
  MeResponse,
  ApiKey,
  CreatedApiKey,
  TeamMember,
  AuditEvent,
  Webhook,
  WebhookDelivery,
  PaginationMeta,
  PaginatedResponse,
  UseQueryResult,
  UseMutationResult,
  TenantSsrContext,
} from './types.js'
