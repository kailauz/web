import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY;

let supabase;

function getSupabase() {
  if (!supabaseUrl || !supabaseKey) return null;
  if (!supabase) {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return supabase;
}

async function readWaitlistCount(client) {
  const { data, error } = await client.rpc('get_landing_waitlist_count');
  if (error) return null;

  const count = Number(data);
  return Number.isSafeInteger(count) && count >= 0 ? count : null;
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const client = getSupabase();
  if (!client) {
    res.status(500).json({ error: 'Supabase env is missing' });
    return;
  }

  if (req.method === 'GET') {
    const count = await readWaitlistCount(client);
    if (count === null) {
      res.status(503).json({ error: 'Waitlist count is unavailable' });
      return;
    }

    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    res.status(200).json({ count });
    return;
  }

  const email = String(req.body?.email || '').trim().toLowerCase();
  const locale = req.body?.lang === 'ru' ? 'ru' : 'en';
  const source = String(req.body?.source || 'landing').trim().slice(0, 100);
  const consent = req.body?.consent === true;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ error: 'Invalid email' });
    return;
  }

  if (!consent) {
    res.status(400).json({ error: 'Consent is required' });
    return;
  }

  const { error } = await client.from('landing_waitlist').insert({
    email,
    locale,
    source,
    consent_email_marketing: true,
    consent_at: new Date().toISOString(),
    user_agent: req.headers['user-agent'] || null,
  });

  if (error) {
    if (error.code === '23505') {
      const count = await readWaitlistCount(client);
      res.status(200).json({ ok: true, duplicate: true, ...(count === null ? {} : { count }) });
      return;
    }

    res.status(500).json({ error: error.message });
    return;
  }

  const count = await readWaitlistCount(client);
  res.status(200).json({ ok: true, ...(count === null ? {} : { count }) });
}
