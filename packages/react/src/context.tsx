// ──────────────────────────────────────────────────────
// @tenantscale/react — Tenant Provider & Context
// ──────────────────────────────────────────────────────

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { TenantScaleClient } from './client.js'
import type { MeResponse, TenantScaleReactOptions } from './types.js'

// ── Context ──

interface TenantContextValue {
  client: TenantScaleClient
  me: MeResponse | null
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

const TenantContext = createContext<TenantContextValue | null>(null)

// ── Provider ──

export interface TenantProviderProps extends TenantScaleReactOptions {
  children: React.ReactNode
  /** Skip auto-fetching on mount (e.g. for SSR hydration) */
  skipFetch?: boolean
}

export function TenantProvider({
  children,
  baseUrl,
  fetch: fetchImpl,
  getAccessToken,
  skipFetch = false,
}: TenantProviderProps) {
  const clientRef = useRef<TenantScaleClient | null>(null)
  if (!clientRef.current) {
    clientRef.current = new TenantScaleClient({ baseUrl, fetch: fetchImpl, getAccessToken })
  }
  const client = clientRef.current

  const [me, setMe] = useState<MeResponse | null>(null)
  const [isLoading, setIsLoading] = useState(!skipFetch)
  const [error, setError] = useState<Error | null>(null)

  const fetchMe = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await client.getMe()
      setMe(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
    } finally {
      setIsLoading(false)
    }
  }, [client])

  // Fetch on mount
  useEffect(() => {
    if (!skipFetch) {
      fetchMe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <TenantContext.Provider value={{ client, me, isLoading, error, refetch: fetchMe }}>
      {children}
    </TenantContext.Provider>
  )
}

// ── Hook ──

export function useTenantScale(): TenantContextValue {
  const ctx = useContext(TenantContext)
  if (!ctx) {
    throw new Error(
      'useTenantScale must be used within a <TenantProvider>. ' +
      'Wrap your app with <TenantProvider baseUrl="..."> to use TenantScale hooks.',
    )
  }
  return ctx
}

/** Get the raw API client (for imperative calls) */
export function useClient(): TenantScaleClient {
  return useTenantScale().client
}
