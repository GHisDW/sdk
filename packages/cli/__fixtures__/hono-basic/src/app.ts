import { Hono } from 'hono';
import { createMiddleware } from 'hono/factory';
import { createClient } from '@supabase/supabase-js';

const app = new Hono();
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Auth middleware
const auth = createMiddleware(async (c, next) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return c.json({ error: 'Unauthorized' }, 401);
  c.set('userId', 'test-user');
  await next();
});

// Routes
app.get('/api/projects', auth, async (c) => {
  const { data } = await supabase.from('projects').select('*');
  return c.json(data);
});

app.post('/api/projects', auth, async (c) => {
  const body = await c.req.json();
  const { data } = await supabase.from('projects').insert(body);
  return c.json(data);
});

app.get('/api/invoices', auth, async (c) => {
  const { data } = await supabase.from('invoices').select('*');
  return c.json(data);
});

app.get('/health', async (c) => {
  return c.json({ status: 'ok' });
});

export default app;
