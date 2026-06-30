import express from 'express';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const app = express();
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Auth middleware
function authenticate(req: any, res: any, next: any) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Routes
app.get('/api/projects', authenticate, async (req, res) => {
  const { data } = await supabase.from('projects').select('*');
  res.json(data);
});

app.post('/api/projects', authenticate, async (req, res) => {
  const { data } = await supabase.from('projects').insert(req.body);
  res.json(data);
});

app.get('/api/projects/:id', authenticate, async (req, res) => {
  const { data } = await supabase.from('projects').select('*').eq('id', req.params.id);
  res.json(data);
});

app.get('/api/invoices', authenticate, async (req, res) => {
  const { data } = await supabase.from('invoices').select('*');
  res.json(data);
});

app.post('/api/invoices', authenticate, async (req, res) => {
  const { data } = await supabase.from('invoices').insert(req.body);
  res.json(data);
});

app.get('/health', async (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(3000, () => console.log('Server running'));
