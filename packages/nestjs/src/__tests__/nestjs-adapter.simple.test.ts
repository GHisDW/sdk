import { describe, it, expect } from 'vitest'
import { TenantScaleModule } from '../tenant-scale.module.js'
import { TenantScaleService } from '../tenant-scale.service.js'
import { TenantScaleGuard } from '../tenant-scale.guard.js'
import { TenantScaleInterceptor } from '../tenant-scale.interceptor.js'
import { AuthenticateApiKey, RequirePlanLimit, AuditLog } from '../decorators.js'
import { Reflector } from '@nestjs/core'
import { Test } from '@nestjs/testing'
import { TenantScale } from '@tenantscale/sdk'

class MockTenantScale extends TenantScale {
  constructor() {
    super({ supabaseUrl: 'https://example.supabase.co', supabaseKey: 'service-role-key' } as never)
  }

  override async validateApiKey(token: string): Promise<{ tenant_id: string; key_record_id: string }> {
    return token === 'valid' ? { tenant_id: 'tenant-1', key_record_id: 'key-1' } : Promise.reject(new Error('Invalid key'))
  }
}

describe('TenantScale NestJS adapter', () => {
  it('registers the module and exposes the service', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TenantScaleModule.forRoot({ apiKey: 'test-key', tenantScale: new MockTenantScale() } as never)],
    }).compile()

    const service = moduleRef.get(TenantScaleService)
    expect(service).toBeDefined()
    expect(service.sdk).toBeDefined()
  })

  it('creates guard and interceptor instances', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TenantScaleModule.forRoot({ apiKey: 'test-key', tenantScale: new MockTenantScale() } as never)],
    }).compile()

    const guard = moduleRef.get(TenantScaleGuard)
    const interceptor = moduleRef.get(TenantScaleInterceptor)
    const reflector = moduleRef.get(Reflector)

    expect(guard).toBeInstanceOf(TenantScaleGuard)
    expect(interceptor).toBeInstanceOf(TenantScaleInterceptor)
    expect(typeof reflector.getAllAndOverride).toBe('function')
  })

  it('exposes decorators that attach metadata', () => {
    const authenticate = AuthenticateApiKey()
    const plan = RequirePlanLimit('pro')
    const audit = AuditLog({ action: 'List Users', resource: 'users' })

    expect(authenticate).toBeDefined()
    expect(plan).toBeDefined()
    expect(audit).toBeDefined()
  })
})
