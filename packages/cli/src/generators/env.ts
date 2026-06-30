// ──────────────────────────────────────────────────────
// @tenantscale/cli — Environment Template Generator
// ──────────────────────────────────────────────────────

export interface EnvResult {
  files: { path: string; content: string; description: string }[]
}

/**
 * Generate .env template and configuration files.
 */
export function generateEnvConfig(outputDir: string): EnvResult {
  return {
    files: [
      {
        path: `${outputDir}/.env.tenantscale`,
        description: 'TenantScale environment variables template',
        content: `# TenantScale Configuration
# Copy these variables to your .env file

# Supabase (required)
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# TenantScale API (optional — for cloud features)
TENANTSCALE_API_KEY=your_tenantscale_api_key

# Stripe (optional — for plan enforcement + billing)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Rate Limiting
RATE_LIMIT_ENABLED=true
`,
      },
      {
        path: `${outputDir}/TENANTSCALE_CONFIG.md`,
        description: 'Configuration guide',
        content: `# TenantScale Configuration Guide

## Environment Variables

### Required

- \`SUPABASE_URL\` — Your Supabase project URL (https://app.supabase.com → Settings → API)
- \`SUPABASE_SERVICE_ROLE_KEY\` — Your Supabase service_role key (bypasses RLS for admin operations)

### Optional

- \`TENANTSCALE_API_KEY\` — If using TenantScale Cloud for analytics dashboard
- \`STRIPE_SECRET_KEY\` — Needed for plan enforcement and billing features
- \`STRIPE_WEBHOOK_SECRET\` — For Stripe subscription status changes
- \`RATE_LIMIT_ENABLED\` — Set to "false" to disable rate limiting during development

## Next Steps

1. Copy .env.tenantscale to your project root as .env
2. Fill in your Supabase project credentials
3. Run the SQL migrations in numeric order
4. Import the generated middleware into your app
5. Test with a tenant API key: \`curl -H "x-api-key: <key>" http://localhost:3000/api/your-endpoint\`

## Verify It Works

\`\`\`bash
# Generate a test API key (via your app)
curl -X POST http://localhost:3000/api/keys \\
  -H "Content-Type: application/json" \\
  -d '{"label": "test"}'

# Use the key
curl http://localhost:3000/api/projects \\
  -H "x-api-key: ts_xxxxxx_xxxxxx"
\`\`\`
`,
      },
    ],
  }
}
