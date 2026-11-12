import { createHmac } from 'crypto';
import { isIP } from 'net';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY;

let supabase;
let writer;

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

// Writes use the existing private server-side Supabase credential. Never expose it
// through NEXT_PUBLIC variables; missing deployment configuration fails closed.
function getWaitlistWriter() {
  const privateKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !privateKey) return null;
  if (!writer) writer = createClient(supabaseUrl, privateKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return writer;
}

async function checkWaitlistLimit(client, req, email) {
  // Vercel supplies this header. On other hosts trust only the socket peer, never
  // caller-controlled forwarded headers. Other reverse proxies need a separate setup.
  const forwarded = req.headers['x-vercel-forwarded-for'];
  const ip = process.env.VERCEL === '1'
    ? (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : '')
    : String(req.socket?.remoteAddress || '');
  if (!isIP(ip)) return { unavailable: true };
  const principalLimit = Math.max(Number(process.env.AUTH_RATE_LIMIT_SIGN_UP || 5), 1);
  const multiplier = Math.max(Number(process.env.AUTH_RATE_LIMIT_IP_MULTIPLIER || 6), 1);
  const windowSeconds = Math.max(Number(process.env.AUTH_RATE_LIMIT_WINDOW_SECONDS || 900), 60);
  if (![principalLimit, multiplier, windowSeconds, principalLimit * multiplier].every(Number.isSafeInteger)) {
    return { unavailable: true };
  }
  const pepper = process.env.AUTH_RATE_LIMIT_PEPPER || createHmac('sha256', process.env.SUPABASE_SERVICE_ROLE_KEY)
    .update('kailauz:auth-rate-limit:v1').digest('hex');
  for (const bucket of [
    { value: `waitlist:sign_up:ip:${ip}`, limit: principalLimit * multiplier },
    { value: `waitlist:sign_up:principal:${email}`, limit: principalLimit },
  ]) {
    const key = createHmac('sha256', pepper).update(bucket.value).digest('hex');
    const { data, error } = await client.rpc('consume_auth_rate_limit', {
      p_action: 'waitlist_sign_up', p_bucket_key: key,
      p_limit: bucket.limit, p_window_seconds: windowSeconds,
    });
    const result = Array.isArray(data) ? data[0] : null;
    if (error || !result || typeof result.allowed !== 'boolean') return { unavailable: true };
    if (!result.allowed) return {
      retryAfter: Number.isSafeInteger(result.retry_after_seconds) && result.retry_after_seconds > 0
        ? result.retry_after_seconds : windowSeconds,
    };
  }
  return { allowed: true };
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

  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ error: 'Invalid email' });
    return;
  }

  if (!consent) {
    res.status(400).json({ error: 'Consent is required' });
    return;
  }

  const writeClient = getWaitlistWriter();
  if (!writeClient) {
    res.status(503).json({ error: 'Signup is temporarily unavailable' });
    return;
  }

  const limit = await checkWaitlistLimit(writeClient, req, email).catch(() => ({ unavailable: true }));
  if (limit.unavailable) {
    res.status(503).json({ error: 'Signup is temporarily unavailable' });
    return;
  }
  if (!limit.allowed) {
    res.setHeader('Retry-After', String(limit.retryAfter));
    res.status(429).json({ error: 'Too many signup attempts', retry_after_seconds: limit.retryAfter });
    return;
  }

  const { error } = await writeClient.from('landing_waitlist').insert({
    email,
    locale,
    source,
    consent_email_marketing: true,
    consent_at: new Date().toISOString(),
    user_agent: String(req.headers['user-agent'] || '').slice(0, 1000) || null,
  });

  if (error) {
    if (error.code === '23505') {
      const count = await readWaitlistCount(client);
      res.status(200).json({ ok: true, ...(count === null ? {} : { count }) });
      return;
    }

    res.status(500).json({ error: 'Signup is temporarily unavailable' });
    return;
  }

  const count = await readWaitlistCount(client);
  res.status(200).json({ ok: true, ...(count === null ? {} : { count }) });
}
