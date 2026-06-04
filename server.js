const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');
const ws = require('ws');

dotenv.config({ path: path.join(__dirname, '.env') });

const port = Number(process.env.PORT || 3000);
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are required in apps/web/.env');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  realtime: {
    transport: ws,
  },
});

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8'
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function serveFile(filePath, res) {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      sendJson(res, 404, { error: 'Not found' });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

function getStaticPath(requestPath) {
  if (requestPath === '/' || requestPath === '') {
    return path.join(__dirname, 'index.html');
  }

  const normalized = path.normalize(requestPath).replace(/^([.][.][/\\])+/, '');
  return path.join(__dirname, normalized);
}

async function handleWaitlist(req, res) {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk;
    if (body.length > 1_000_000) {
      req.destroy();
    }
  });

  req.on('end', async () => {
    try {
      const payload = JSON.parse(body || '{}');
      const email = String(payload.email || '').trim().toLowerCase();
      const locale = payload.lang === 'ru' ? 'ru' : 'en';
      const source = String(payload.source || 'landing').trim().slice(0, 100);

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        sendJson(res, 400, { error: 'Invalid email' });
        return;
      }

      const { error } = await supabase
        .from('landing_waitlist')
        .insert({
          email,
          locale,
          source,
          user_agent: req.headers['user-agent'] || null,
        });

      if (error) {
        console.error(error);
        sendJson(res, 500, { error: error.message });
        return;
      }

      sendJson(res, 200, { ok: true });
    } catch (error) {
      console.error(error);
      sendJson(res, 500, { error: 'Server error' });
    }
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'POST' && url.pathname === '/api/waitlist') {
    await handleWaitlist(req, res);
    return;
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  const filePath = getStaticPath(url.pathname);
  serveFile(filePath, res);
});

server.listen(port, () => {
  console.log(`kailauz web running on http://localhost:${port}`);
});
