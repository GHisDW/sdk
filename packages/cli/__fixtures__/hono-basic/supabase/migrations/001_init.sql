-- Hono fixture schema
create table projects (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  created_at timestamptz default now()
);

create table invoices (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references projects(id),
  amount integer not null,
  created_at timestamptz default now()
);
