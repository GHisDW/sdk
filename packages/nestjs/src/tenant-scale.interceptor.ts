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

import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { TENANT_SCALE_CONTEXT_TOKEN, type TenantScaleExecutionContext } from './types.js'
import { TenantScaleService } from './tenant-scale.service.js'

@Injectable()
export class TenantScaleInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly tenantScaleService: TenantScaleService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<TenantScaleExecutionContext['request']>()
    if (!req.tenant) {
      req.tenant = {
        requestId: req.headers?.['x-request-id']?.toString(),
      }
    }

    ;(req as unknown as Record<symbol, unknown>)[TENANT_SCALE_CONTEXT_TOKEN] = req.tenant

    const handler = context.getHandler()
    const instance = context.getClass()
    const audit = this.reflector.getAllAndOverride<{ action: string; resource?: string }>('tenantScale:auditLog', [handler, instance])

    return next.handle().pipe(
      tap(async () => {
        if (audit && req.tenant?.tenantId) {
          await this.tenantScaleService.auditLog(req.tenant.tenantId, audit.action, audit.resource ?? 'request')
        }
      }),
    )
  }
}
