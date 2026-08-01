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

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Inject,
  UnauthorizedException,
} from '@nestjs/common'
import { TenantScale, AuthenticationError, TenantScaleError } from '@tenantscale/sdk'
import { TENANT_SCALE_TOKEN, type TenantScaleModuleOptions } from './types.js'

@Injectable()
export class TenantScaleService {
  constructor(@Inject(TENANT_SCALE_TOKEN) private readonly tenantScale: TenantScale) {}

  get sdk(): TenantScale {
    return this.tenantScale
  }

  get options(): TenantScaleModuleOptions {
    return this.tenantScale as unknown as TenantScaleModuleOptions
  }

  async authenticateApiKey(token: string): Promise<unknown> {
    try {
      return await this.tenantScale.validateApiKey(token)
    } catch (error) {
      throw this.toNestException(error)
    }
  }

  requireScope(apiKey: unknown, ...scopes: string[]): void {
    try {
      this.tenantScale.requireScope(apiKey as never, ...scopes)
    } catch (error) {
      throw this.toNestException(error)
    }
  }

  async requirePlanLimit(
    tenantId: string | undefined,
    feature: string,
    currentCount: number,
  ): Promise<void> {
    if (!tenantId) {
      throw new BadRequestException('Tenant ID is required')
    }

    try {
      const limit = await this.tenantScale.plans.getPlanLimit(tenantId, feature)
      if (limit !== null && currentCount >= limit) {
        throw new ForbiddenException(`Plan limit exceeded for ${feature}`)
      }
    } catch (error) {
      throw this.toNestException(error)
    }
  }

  async auditLog(tenantId: string | undefined, action: string, resource: string): Promise<void> {
    if (!tenantId) return

    await this.tenantScale.logAuditEvent({
      tenant_id: tenantId,
      actor_id: null,
      actor_type: 'system',
      action,
      resource,
      details: {},
    })
  }

  private toNestException(error: unknown): Error {
    if (error instanceof AuthenticationError) {
      return new UnauthorizedException(error.message)
    }

    if (error instanceof TenantScaleError) {
      return new ForbiddenException(error.message)
    }

    if (error instanceof Error) {
      return new UnauthorizedException(error.message)
    }

    return new UnauthorizedException('TenantScale authentication failed')
  }
}
