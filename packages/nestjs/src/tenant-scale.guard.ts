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

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { TENANT_SCALE_CONTEXT_TOKEN, type TenantScaleExecutionContext } from './types.js'
import { TenantScaleService } from './tenant-scale.service.js'

@Injectable()
export class TenantScaleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tenantScaleService: TenantScaleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<TenantScaleExecutionContext['request']>()
    const handler = context.getHandler()
    const instance = context.getClass()
    const requiresAuth =
      this.reflector.getAllAndOverride<boolean>('tenantScale:authenticateApiKey', [handler, instance]) ?? false

    if (!requiresAuth) {
      return true
    }

    const rawToken = req.headers?.['authorization']?.toString() ?? req.headers?.['x-api-key']?.toString()
    if (!rawToken) {
      throw new UnauthorizedException('Authentication required')
    }

    const token = rawToken.startsWith('Bearer ') ? rawToken.slice(7).trim() : rawToken
    const result = await this.tenantScaleService.authenticateApiKey(token)

    const tenant = {
      tenantId: (result as { tenant_id?: string }).tenant_id,
      tenantKey: result,
    }

    req.tenant = tenant
    ;(req as unknown as Record<symbol, unknown>)[TENANT_SCALE_CONTEXT_TOKEN] = tenant

    const planFeature = this.reflector.getAllAndOverride<string>('tenantScale:requirePlanLimit', [handler, instance])
    if (planFeature) {
      await this.tenantScaleService.requirePlanLimit(tenant.tenantId, planFeature, 1)
    }

    return true
  }
}
