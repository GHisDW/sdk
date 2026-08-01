# @tenantscale/nestjs

**NestJS adapter for TenantScale** — module registration, dependency injection, guards, interceptors, and metadata-driven decorators for auth, plan enforcement, and audit logging.

## Install

```bash
npm install @tenantscale/nestjs
# or
pnpm add @tenantscale/nestjs
```

## Quick Start

```ts
import { Module } from '@nestjs/common'
import { TenantScaleModule, TenantScaleService, AuthenticateApiKey, RequirePlanLimit, AuditLog } from '@tenantscale/nestjs'

@Module({
  imports: [
    TenantScaleModule.forRoot({
      apiKey: process.env.TENANTSCALE_API_KEY,
    }),
  ],
})
export class AppModule {}
```

```ts
@Controller('users')
export class UsersController {
  constructor(private readonly tenantScale: TenantScaleService) {}

  @Get()
  @AuthenticateApiKey()
  @RequirePlanLimit('pro')
  @AuditLog({ action: 'List Users', resource: 'users' })
  findUsers() {
    return this.tenantScale.sdk
  }
}
```

## Features

- 🧩 Dynamic NestJS module registration
- 🔐 Injectable TenantScaleService for dependency injection
- 🛡️ TenantScaleGuard for request authentication
- 🧵 TenantScaleInterceptor for request-scoped tenant context
- 🏷️ Decorators for auth, plan enforcement, and audit logging
- ⚠️ Nest-compatible exception mapping
