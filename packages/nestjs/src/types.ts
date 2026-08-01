/*
 * MIT License
 *
 * Copyright (c) 2026 TenantScale
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import type { TenantScale, TenantScaleOptions } from '@tenantscale/sdk'

export interface TenantScaleModuleOptions extends TenantScaleOptions {
  apiKey?: string
  tenantId?: string
  tenantScale?: TenantScaleInstance
  tenantScaleFactory?: () => TenantScaleInstance | Promise<TenantScaleInstance>
}

export interface TenantScaleRequestContext {
  tenantId?: string
  tenantKey?: unknown
  portalSession?: unknown
  requestId?: string
}

export interface TenantScaleExecutionContext {
  request: {
    tenant?: TenantScaleRequestContext
    headers?: Record<string, string | string[] | undefined>
    method?: string
    url?: string
    [key: string]: unknown
  }
  [key: string]: unknown
}

export type TenantScaleModuleOptionsFactory = () =>
  TenantScaleModuleOptions | Promise<TenantScaleModuleOptions>

export const TENANT_SCALE_TOKEN = Symbol('TENANT_SCALE_TOKEN')
export const TENANT_SCALE_OPTIONS_TOKEN = Symbol('TENANT_SCALE_OPTIONS_TOKEN')
export const TENANT_SCALE_CONTEXT_TOKEN = Symbol('TENANT_SCALE_CONTEXT_TOKEN')

export type TenantScaleInstance = TenantScale
