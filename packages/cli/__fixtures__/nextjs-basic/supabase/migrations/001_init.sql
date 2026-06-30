-- Next.js fixture schema
create table projects (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  created_at timestamptz default now()
);

create table documents (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  tenant_id uuid references tenants(id),
  created_at timestamptz default now()
);
