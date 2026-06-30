// ──────────────────────────────────────────────────────
// @tenantscale/react — useTenant hook
// ──────────────────────────────────────────────────────

import { useTenantScale } from '../context.js'
import type { UseQueryResult, TenantInfo, UserProfile, PlanInfo, DeploymentInfo } from '../types.js'
import { useMemo } from 'react'

export interface TenantContext {
  user: UserProfile
  tenant: TenantInfo
  plan: PlanInfo
  deployment: DeploymentInfo
}

export function useTenant(): UseQueryResult<TenantContext> & { tenant: TenantContext | null } {
  const { me, isLoading, error, refetch } = useTenantScale()

  const context = useMemo(() => {
    if (!me) return null
    return {
      user: me.user,
      tenant: me.tenant,
      plan: me.plan,
      deployment: me.deployment,
    }
  }, [me])

  return { data: context, tenant: context, error, isLoading, refetch }
}
