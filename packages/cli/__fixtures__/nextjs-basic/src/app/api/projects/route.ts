import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data } = await supabase.from('projects').select('*');
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { data } = await supabase.from('projects').insert(body);
  return NextResponse.json(data);
}
