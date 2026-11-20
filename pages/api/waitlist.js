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
  if (!isIP(ip)) return { unavailable: 'ip' };
  const principalLimit = Math.max(Number(process.env.AUTH_RATE_LIMIT_SIGN_UP || 5), 1);
  const multiplier = Math.max(Number(process.env.AUTH_RATE_LIMIT_IP_MULTIPLIER || 6), 1);
  const windowSeconds = Math.max(Number(process.env.AUTH_RATE_LIMIT_WINDOW_SECONDS || 900), 60);
  if (![principalLimit, multiplier, windowSeconds, principalLimit * multiplier].every(Number.isSafeInteger)) {
    return { unavailable: 'config' };
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
    if (error || !result || typeof result.allowed !== 'boolean') return { unavailable: `rpc:${error?.code || error?.message || 'empty'}` };
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

function sameHost(value, host) {
  try {
    const url = new URL(value);
    return (url.protocol === 'https:' || url.protocol === 'http:') && url.host === host ? url : null;
  } catch {
    return null;
  }
}

function readCampaignSource(req) {
  const referrer = sameHost(req.headers.referer, req.headers.host);
  if (referrer?.pathname !== '/' && referrer?.pathname !== '/en') return null;

  const part = (key, max) => {
    const value = referrer.searchParams.get(`utm_${key}`)?.trim().toLowerCase();
    return value && /^[a-z0-9][a-z0-9_-]*$/.test(value) ? value.slice(0, max) : '';
  };
  const source = part('source', 16);
  if (!source) return null;
  const medium = part('medium', 16);
  const campaign = part('campaign', 34);
  const content = part('content', 24);
  return `utm:${source}/${medium || '-'}/${campaign || '-'}/${content || '-'}`;
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (req.method === 'GET') {
    const client = getSupabase();
    if (!client) return res.status(500).json({ error: 'Supabase env is missing' });

    const count = await readWaitlistCount(client);
    if (count === null) {
      res.status(503).json({ error: 'Waitlist count is unavailable' });
      return;
    }

    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    res.status(200).json({ count });
    return;
  }

  const nativeForm = req.headers['content-type']?.split(';')[0] === 'application/x-www-form-urlencoded';
  const locale = req.body?.lang === 'ru' ? 'ru' : 'en';
  res.setHeader('Cache-Control', 'no-store');
  if (nativeForm && (
    ['cross-site', 'same-site'].includes(req.headers['sec-fetch-site']) ||
    (req.headers.origin && !sameHost(req.headers.origin, req.headers.host))
  )) {
    return res.status(403).json({ error: 'Invalid form origin' });
  }
  const respond = (status, result, body) => (
    nativeForm ? res.redirect(303, `/waitlist/${locale}/${result}`) : res.status(status).json(body)
  );

  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return respond(400, 'email', { error: 'Invalid email' });
  }

  const consent = nativeForm ? req.body.consent === 'true' : req.body.consent === true;
  if (!consent) {
    return respond(400, 'consent', { error: 'Consent is required' });
  }

  const client = getSupabase();
  if (!client) return respond(500, 'unavailable', { error: 'Supabase env is missing' });
  const writeClient = getWaitlistWriter();
  if (!writeClient) {
    console.error(JSON.stringify({ event: 'waitlist.unavailable', reason: 'service_role_key_missing' }));
    return respond(503, 'unavailable', { error: 'Signup is temporarily unavailable' });
  }

  // A broken rate limiter must not stop signups: it is logged and the signup goes through.
  const limit = await checkWaitlistLimit(writeClient, req, email).catch(error => ({ unavailable: `throw:${error?.message || 'unknown'}` }));
  if (limit.unavailable) {
    console.error(JSON.stringify({ event: 'waitlist.limit_unavailable', reason: String(limit.unavailable).slice(0, 200) }));
  } else if (!limit.allowed) {
    res.setHeader('Retry-After', String(limit.retryAfter));
    return respond(429, 'unavailable', { error: 'Too many signup attempts', retry_after_seconds: limit.retryAfter });
  }

  const campaign = readCampaignSource(req);
  const { error } = await writeClient.from('landing_waitlist').insert({
    email,
    locale,
    source: campaign || String(req.body.source || 'landing').trim().slice(0, 100) || 'landing',
    consent_email_marketing: true,
    consent_at: new Date().toISOString(),
    user_agent: String(req.headers['user-agent'] || '').slice(0, 1000) || null,
  });

  if (error && error.code !== '23505') {
    console.error(JSON.stringify({ event: 'waitlist.insert_failed', code: error.code || null, message: String(error.message || '').slice(0, 200) }));
    return respond(500, 'unavailable', { error: 'Signup is temporarily unavailable' });
  }

  if (!error) console.info(JSON.stringify({ event: 'waitlist.signup', source: campaign || 'landing', locale }));
  const count = nativeForm ? null : await readWaitlistCount(client);
  return respond(200, 'success', { ok: true, ...(count === null ? {} : { count }) });
}
