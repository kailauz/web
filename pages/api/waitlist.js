import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const email = String(req.body?.email || '').trim().toLowerCase();
  const locale = req.body?.lang === 'ru' ? 'ru' : 'en';
  const source = String(req.body?.source || 'landing').trim().slice(0, 100);
  const consent = req.body?.consent === true;

  if (!supabaseUrl || !supabaseKey) {
    res.status(500).json({ error: 'Supabase env is missing' });
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ error: 'Invalid email' });
    return;
  }

  if (!consent) {
    res.status(400).json({ error: 'Consent is required' });
    return;
  }

  const { error } = await supabase.from('landing_waitlist').insert({
    email,
    locale,
    source,
    consent_email_marketing: true,
    consent_at: new Date().toISOString(),
    user_agent: req.headers['user-agent'] || null,
  });

  if (error) {
    if (error.code === '23505') {
      res.status(200).json({ ok: true, duplicate: true });
      return;
    }

    res.status(500).json({ error: error.message });
    return;
  }

  res.status(200).json({ ok: true });
}
