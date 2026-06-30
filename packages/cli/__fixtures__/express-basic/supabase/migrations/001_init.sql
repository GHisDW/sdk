-- Initial schema
create table projects (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  user_id uuid references auth.users(id),
  created_at timestamptz default now()
);

create table invoices (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references projects(id),
  amount integer not null,
  status text default 'pending',
  user_id uuid references auth.users(id),
  created_at timestamptz default now()
);

create table teams (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  tenant_id uuid references tenants(id),
  created_at timestamptz default now()
);

create table documents (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text,
  created_at timestamptz default now()
);
