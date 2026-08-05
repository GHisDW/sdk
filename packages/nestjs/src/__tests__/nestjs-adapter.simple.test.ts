import { describe, it, expect, beforeEach, vi } from 'vitest'
import { TenantScaleModule } from '../tenant-scale.module.js'
import { TenantScaleService } from '../tenant-scale.service.js'
import { TenantScaleGuard } from '../tenant-scale.guard.js'
import { TenantScaleInterceptor } from '../tenant-scale.interceptor.js'
import { AuthenticateApiKey, RequirePlanLimit, RequireScope, AuditLog } from '../decorators.js'
import {
  TenantContext,
  TenantId,
  getTenantScaleContext,
  runWithTenantScaleContext,
  setTenantScaleContext,
} from '../request-context.js'
import { Reflector } from '@nestjs/core'
import { Test } from '@nestjs/testing'
import { TenantScale } from '@tenantscale/sdk'
import {
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common'
import type { ApiKeyInfo } from '@tenantscale/sdk'
import 'reflect-metadata'

class MockTenantScale extends TenantScale {
  constructor() {
    super({ supabaseUrl: 'https://example.supabase.co', supabaseKey: 'service-role-key' } as never)
  }

  override async validateApiKey(token: string): Promise<ApiKeyInfo> {
    if (token === 'valid') {
      return {
        tenant_id: 'tenant-1',
        key_record_id: 'key-1',
        scopes: ['read', 'write'],
      } as ApiKeyInfo
    }
    throw new Error('Invalid key')
  }

  override requireScope(apiKey: ApiKeyInfo, ...scopes: string[]): void {
    const keyScopes = apiKey.scopes || []
    const hasAllScopes = scopes.every((scope) => keyScopes.includes(scope))
    if (!hasAllScopes) {
      throw new Error('Missing required scope')
    }
  }

  override async logAuditEvent(event: {
    tenant_id: string
    action: string
    resource: string
  }): Promise<void> {
    // Mock implementation
  }
}

describe('TenantScale NestJS adapter', () => {
  describe('Module registration', () => {
    it('registers the module with forRoot using tenantScale instance', async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [
          TenantScaleModule.forRoot({
            tenantScale: new MockTenantScale(),
          }),
        ],
      }).compile()

      const service = moduleRef.get(TenantScaleService)
      expect(service).toBeDefined()
      expect(service.sdk).toBeDefined()
    })

    it('registers the module with forRoot using sdkOptions', async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [
          TenantScaleModule.forRoot({
            sdkOptions: {
              supabaseUrl: 'https://example.supabase.co',
              supabaseKey: 'service-role-key',
            } as never,
          }),
        ],
      }).compile()

      const service = moduleRef.get(TenantScaleService)
      expect(service).toBeDefined()
    })

    it('registers the module with forRootAsync', async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [
          TenantScaleModule.forRootAsync({
            useFactory: () => ({
              tenantScale: new MockTenantScale(),
            }),
          }),
        ],
      }).compile()

      const service = moduleRef.get(TenantScaleService)
      expect(service).toBeDefined()
    })

    it('registers the module with forRootAsync with dependencies', async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [
          TenantScaleModule.forRootAsync({
            useFactory: () => ({
              tenantScale: new MockTenantScale(),
            }),
            inject: [],
          }),
        ],
      }).compile()

      const service = moduleRef.get(TenantScaleService)
      expect(service).toBeDefined()
    })

    it('throws error when no tenantScale, tenantScaleFactory, or sdkOptions provided', async () => {
      await expect(
        Test.createTestingModule({
          imports: [
            TenantScaleModule.forRoot({
              apiKeyHeader: 'x-custom-key',
            } as never),
          ],
        }).compile(),
      ).rejects.toThrow('Either tenantScale, tenantScaleFactory, or sdkOptions must be provided')
    })

    it('exports all necessary providers', async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [
          TenantScaleModule.forRoot({
            tenantScale: new MockTenantScale(),
          }),
        ],
      }).compile()

      expect(moduleRef.get(TenantScaleService)).toBeDefined()
      expect(moduleRef.get(TenantScaleGuard)).toBeDefined()
      expect(moduleRef.get(TenantScaleInterceptor)).toBeDefined()
    })
  })

  describe('TenantScaleService', () => {
    let service: TenantScaleService

    beforeEach(async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [
          TenantScaleModule.forRoot({
            tenantScale: new MockTenantScale(),
          }),
        ],
      }).compile()

      service = moduleRef.get(TenantScaleService)
    })

    it('exposes the SDK instance', () => {
      expect(service.sdk).toBeDefined()
    })

    it('exposes module options', () => {
      expect(service.moduleOptions).toBeDefined()
    })

    it('authenticates valid API key', async () => {
      const result = await service.authenticateApiKey('valid')
      expect(result.tenant_id).toBe('tenant-1')
    })

    it('throws UnauthorizedException for invalid API key', async () => {
      await expect(service.authenticateApiKey('invalid')).rejects.toThrow(UnauthorizedException)
    })

    it('requires scope when apiKey has required scopes', () => {
      const apiKey = { tenant_id: 'tenant-1', scopes: ['read', 'write'] } as ApiKeyInfo
      expect(() => service.requireScope(apiKey, 'read')).not.toThrow()
    })

    it('throws UnauthorizedException when apiKey is undefined', () => {
      expect(() => service.requireScope(undefined, 'read')).toThrow(UnauthorizedException)
    })

    it('throws error when apiKey lacks required scope', () => {
      const apiKey = { tenant_id: 'tenant-1', scopes: ['read'] } as ApiKeyInfo
      expect(() => service.requireScope(apiKey, 'write')).toThrow()
    })

    it('requires plan limit when tenantId exists', async () => {
      vi.spyOn(service.sdk.plans, 'getPlanLimit').mockResolvedValue(null)
      await expect(service.requirePlanLimit('tenant-1', 'feature', 1)).resolves.not.toThrow()
    })

    it('throws BadRequestException when tenantId is missing', async () => {
      await expect(service.requirePlanLimit(undefined, 'feature', 1)).rejects.toThrow(
        BadRequestException,
      )
    })

    it('throws ForbiddenException when plan limit exceeded', async () => {
      vi.spyOn(service.sdk.plans, 'getPlanLimit').mockResolvedValue(5)
      await expect(service.requirePlanLimit('tenant-1', 'feature', 10)).rejects.toThrow(
        ForbiddenException,
      )
    })

    it('logs audit event when tenantId exists', async () => {
      vi.spyOn(service.sdk, 'logAuditEvent').mockResolvedValue()
      await service.auditLog('tenant-1', 'action', 'resource')
      expect(service.sdk.logAuditEvent).toHaveBeenCalled()
    })

    it('skips audit log when tenantId is missing', async () => {
      vi.spyOn(service.sdk, 'logAuditEvent').mockResolvedValue()
      await service.auditLog(undefined, 'action', 'resource')
      expect(service.sdk.logAuditEvent).not.toHaveBeenCalled()
    })
  })

  describe('TenantScaleGuard', () => {
    let guard: TenantScaleGuard
    let reflector: Reflector

    beforeEach(async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [
          TenantScaleModule.forRoot({
            tenantScale: new MockTenantScale(),
          }),
        ],
      }).compile()

      guard = moduleRef.get(TenantScaleGuard)
      reflector = moduleRef.get(Reflector)
    })

    it('returns true when authentication is not required', async () => {
      const context = createMockExecutionContext(reflector, false)
      expect(await guard.canActivate(context)).toBe(true)
    })

    it('throws UnauthorizedException when token is missing', async () => {
      const context = createMockExecutionContext(reflector, true, {})
      await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException)
    })

    it('authenticates with valid token from x-api-key header', async () => {
      const context = createMockExecutionContext(reflector, true, { 'x-api-key': 'valid' })
      expect(await guard.canActivate(context)).toBe(true)
      expect(context.switchToHttp().getRequest().tenantId).toBe('tenant-1')
    })

    it('authenticates with valid token from authorization header', async () => {
      const context = createMockExecutionContext(reflector, true, { authorization: 'valid' })
      expect(await guard.canActivate(context)).toBe(true)
    })

    it('authenticates with Bearer token from authorization header', async () => {
      const context = createMockExecutionContext(reflector, true, { authorization: 'Bearer valid' })
      expect(await guard.canActivate(context)).toBe(true)
    })

    it('throws UnauthorizedException for invalid token', async () => {
      const context = createMockExecutionContext(reflector, true, { 'x-api-key': 'invalid' })
      await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException)
    })

    it('checks plan limit when metadata is set', async () => {
      vi.spyOn(guard['tenantScaleService'].sdk.plans, 'getPlanLimit').mockResolvedValue(null)
      const context = createMockExecutionContext(
        reflector,
        true,
        { 'x-api-key': 'valid' },
        'pro-feature',
      )
      expect(await guard.canActivate(context)).toBe(true)
    })

    it('checks scope requirements when metadata is set', async () => {
      const context = createMockExecutionContext(
        reflector,
        true,
        { 'x-api-key': 'valid' },
        undefined,
        ['read'],
      )
      expect(await guard.canActivate(context)).toBe(true)
    })
  })

  describe('TenantScaleInterceptor', () => {
    let interceptor: TenantScaleInterceptor
    let reflector: Reflector

    beforeEach(async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [
          TenantScaleModule.forRoot({
            tenantScale: new MockTenantScale(),
          }),
        ],
      }).compile()

      interceptor = moduleRef.get(TenantScaleInterceptor)
      reflector = moduleRef.get(Reflector)
    })

    it('passes through when no audit metadata is set', async () => {
      const { of } = await import('rxjs')
      const context = createMockExecutionContext(reflector, false)
      const callHandler = { handle: () => of('result') }
      const observable = interceptor.intercept(context, callHandler)
      const result = await observable.toPromise()
      expect(result).toBe('result')
    })

    it('logs audit event when metadata is set and tenantId exists', async () => {
      const { of } = await import('rxjs')
      const context = createMockExecutionContext(
        reflector,
        false,
        undefined,
        undefined,
        undefined,
        {
          action: 'Test',
          resource: 'test',
        },
      )
      context.switchToHttp().getRequest().tenantId = 'tenant-1'
      const callHandler = { handle: () => of('result') }
      const observable = interceptor.intercept(context, callHandler)
      const result = await observable.toPromise()
      expect(result).toBe('result')
    })

    it('does not log audit event when tenantId is missing', async () => {
      const { of } = await import('rxjs')
      const context = createMockExecutionContext(
        reflector,
        false,
        undefined,
        undefined,
        undefined,
        {
          action: 'Test',
          resource: 'test',
        },
      )
      const callHandler = { handle: () => of('result') }
      const observable = interceptor.intercept(context, callHandler)
      const result = await observable.toPromise()
      expect(result).toBe('result')
    })
  })

  describe('Decorators', () => {
    it('AuthenticateApiKey decorator creates metadata', () => {
      const decorator = AuthenticateApiKey()
      expect(decorator).toBeDefined()
    })

    it('RequirePlanLimit decorator creates metadata and applies guard', () => {
      const decorator = RequirePlanLimit('pro')
      expect(decorator).toBeDefined()
    })

    it('RequireScope decorator creates metadata and applies guard', () => {
      const decorator = RequireScope('read', 'write')
      expect(decorator).toBeDefined()
    })

    it('AuditLog decorator creates metadata', () => {
      const decorator = AuditLog({ action: 'Test', resource: 'test' })
      expect(decorator).toBeDefined()
    })
  })

  describe('Parameter decorators', () => {
    it('TenantContext decorator is a callable decorator', () => {
      const decorator = TenantContext()
      expect(typeof decorator).toBe('function')
    })

    it('TenantId decorator is a callable decorator', () => {
      const decorator = TenantId()
      expect(typeof decorator).toBe('function')
    })
  })

  describe('AsyncLocalStorage context', () => {
    it('sets and gets tenant context', () => {
      setTenantScaleContext({ tenantId: 'tenant-1' })
      const context = getTenantScaleContext()
      expect(context?.tenantId).toBe('tenant-1')
    })

    it('runs callback with context', () => {
      let result: string | undefined
      runWithTenantScaleContext({ tenantId: 'tenant-1' }, () => {
        result = getTenantScaleContext()?.tenantId
      })
      expect(result).toBe('tenant-1')
    })

    it('isolates context between concurrent requests', async () => {
      const results: string[] = []

      // Simulate 10 concurrent requests with different tenant IDs
      const promises = Array.from({ length: 10 }, async (_, i) => {
        const tenantId = `tenant-${i}`
        setTenantScaleContext({ tenantId })

        // Simulate async work
        await new Promise((resolve) => setTimeout(resolve, Math.random() * 10))

        const context = getTenantScaleContext()
        results.push(context?.tenantId || 'missing')
      })

      await Promise.all(promises)

      // Each request should have its own isolated context
      expect(results).toHaveLength(10)
      expect(results).toEqual(
        expect.arrayContaining([
          'tenant-0',
          'tenant-1',
          'tenant-2',
          'tenant-3',
          'tenant-4',
          'tenant-5',
          'tenant-6',
          'tenant-7',
          'tenant-8',
          'tenant-9',
        ]),
      )
    })

    it('context does not leak between sequential set operations', () => {
      setTenantScaleContext({ tenantId: 'tenant-1' })
      expect(getTenantScaleContext()?.tenantId).toBe('tenant-1')

      setTenantScaleContext({ tenantId: 'tenant-2' })
      expect(getTenantScaleContext()?.tenantId).toBe('tenant-2')
    })
  })
})

// Helper function to create mock ExecutionContext
function createMockExecutionContext(
  reflector: Reflector,
  requiresAuth: boolean,
  headers: Record<string, string> = {},
  planFeature?: string,
  scopes?: string[],
  auditConfig?: { action: string; resource?: string },
): ExecutionContext {
  const mockRequest = {
    headers,
    tenantId: undefined as string | undefined,
    tenantKey: undefined as ApiKeyInfo | undefined,
  }

  const mockHandler = () => {}
  const mockClass = {}

  // Use Reflect metadata API instead of reflector.set
  if (requiresAuth) {
    Reflect.defineMetadata('tenantScale:authenticateApiKey', true, mockHandler)
  }
  if (planFeature) {
    Reflect.defineMetadata('tenantScale:requirePlanLimit', planFeature, mockHandler)
  }
  if (scopes) {
    Reflect.defineMetadata('tenantScale:requireScope', scopes, mockHandler)
  }
  if (auditConfig) {
    Reflect.defineMetadata('tenantScale:auditLog', auditConfig, mockHandler)
  }

  return {
    switchToHttp: () => ({
      getRequest: () => mockRequest,
    }),
    getHandler: () => mockHandler,
    getClass: () => mockClass,
  } as unknown as ExecutionContext
}
