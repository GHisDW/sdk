// ──────────────────────────────────────────────────────
// @tenantscale/sdk — Barrel exports
// ──────────────────────────────────────────────────────

// Main class
export { TenantScale } from './sdk.js'

// Core modules (for direct use)
export { PlanStore } from './plan.js'
export { RateLimiter } from './rate-limit.js'
export { WebhookDispatcher } from './webhook.js'
export { StripeClient } from './stripe.js'

// Auth
export { validateApiKey, requireScope, hasRequiredScope } from './auth.js'
export { validateApiKey as validateSessionApiKey } from './auth.js'

// API Key generation
export { generateApiKey, hashApiKey, isValidApiKeyFormat } from './api-key.js'

// Session
export { validateSession, requirePortalRole, requireSuperAdmin } from './session.js'

// Audit
export { logAuditEvent, getClientIp, createAuditEvent } from './audit.js'

// Pagination
export { parsePaginationParams, paginationResponse } from './pagination.js'

// SSRF
export { validateWebhookUrl } from './ssrf.js'

// Types
export type {
  TenantScaleOptions,
  ApiKeyInfo,
  PortalSessionInfo,
  GeneratedApiKey,
  PlanInfo,
  PlanLimitError,
  PlanFeatureError,
  AuditEventInput,
  RateLimitResult,
  IpCreationLimitResult,
  PaginationParams,
  PaginationMeta,
  WebhookPayload,
  WebhookDeliveryResult,
  PlanPriceMapping,
  CreateCheckoutOptions,
  CreatePortalOptions,
  Logger,
} from './types.js'

// Error classes
export {
  TenantScaleError,
  AuthenticationError,
  AuthorizationError,
  PlanLimitExceededError,
  RateLimitExceededError,
  NotFoundError,
  ConflictError,
} from './types.js'

// DB type helpers
export type {
  DbTenant,
  DbAuditEvent,
  DbApiKey,
  DbWebhook,
  DbPlan,
  DbTenantUser,
  DbSubscription,
} from './types.js'
