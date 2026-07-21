#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const DEMO_USERS = [
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444',
  '55555555-5555-5555-5555-555555555555',
];

const GENRE_LABELS_RU = {
  adventure: 'Приключения',
  autobiography: 'Автобиографии',
  biography: 'Биографии',
  business: 'Бизнес',
  classics: 'Классика',
  contemporary: 'Современная проза',
  cozy_fantasy: 'Уютное фэнтези',
  cozy_mystery: 'Уютный детектив',
  crime: 'Криминал',
  dark_academia: 'Тёмная академия',
  detective: 'Детектив',
  drama: 'Драма',
  dystopia: 'Антиутопия',
  family: 'Семейные истории',
  fantasy: 'Фэнтези',
  fiction: 'Художественная проза',
  historical_fiction: 'Историческая проза',
  history: 'История',
  horror: 'Хоррор',
  literary_fiction: 'Литературная проза',
  manga: 'Манга',
  memoir: 'Мемуары',
  mystery: 'Детектив',
  nonfiction: 'Нон-фикшн',
  paranormal_romance: 'Паранормальная романтика',
  philosophy: 'Философия',
  productivity: 'Продуктивность',
  psychology: 'Психология',
  romance: 'Романтика',
  science: 'Наука',
  science_fiction: 'Научная фантастика',
  self_help: 'Саморазвитие',
  slice_of_life: 'Повседневность',
  thriller: 'Триллер',
  urban_fantasy: 'Городское фэнтези',
  women_fiction: 'Женская проза',
  young_adult: 'Young Adult',
};

const READER_TYPES = [
  {
    code: 'explorer',
    title: 'Исследователь',
    matchGenres: ['fantasy', 'science_fiction', 'adventure', 'history', 'nonfiction', 'thriller', 'literary_fiction'],
    accent: '#9ed3c7',
    glow: 'rgba(158,211,199,.32)',
    mood: 'Широкий вкус',
    description: 'Тебя тянет к разным полкам, и именно в этом твоя сила.',
  },
  {
    code: 'dreamer',
    title: 'Мечтатель',
    matchGenres: ['fantasy', 'science_fiction', 'cozy_fantasy', 'adventure', 'dystopia', 'urban_fantasy'],
    accent: '#d5c0ff',
    glow: 'rgba(213,192,255,.30)',
    mood: 'Другие миры',
    description: 'Тебе нужны книги, в которые можно красиво провалиться с головой.',
  },
  {
    code: 'detective',
    title: 'Детектив',
    matchGenres: ['thriller', 'mystery', 'detective', 'crime', 'horror'],
    accent: '#f1b07a',
    glow: 'rgba(241,176,122,.28)',
    mood: 'Интрига',
    description: 'Твоя полка любит тайны, напряжение и ощущение охоты за разгадкой.',
  },
  {
    code: 'emotional_reader',
    title: 'Эмоциональный читатель',
    matchGenres: ['romance', 'drama', 'family', 'young_adult', 'women_fiction', 'contemporary'],
    accent: '#efb8c8',
    glow: 'rgba(239,184,200,.28)',
    mood: 'Чувства',
    description: 'Ты выбираешь книги, которые остаются рядом не сюжетом, а сердцем.',
  },
  {
    code: 'thinker',
    title: 'Мыслитель',
    matchGenres: ['philosophy', 'psychology', 'literary_fiction', 'classics', 'science'],
    accent: '#c8d3ee',
    glow: 'rgba(200,211,238,.28)',
    mood: 'Глубина',
    description: 'Тебе важны идеи, послевкусие и те редкие мысли, что остаются надолго.',
  },
  {
    code: 'student',
    title: 'Ученик',
    matchGenres: ['nonfiction', 'business', 'self_help', 'history', 'productivity', 'science', 'psychology'],
    accent: '#d9c485',
    glow: 'rgba(217,196,133,.26)',
    mood: 'Польза',
    description: 'Ты любишь книги, которые дают опору, язык и новый инструмент для жизни.',
  },
  {
    code: 'loyal_fan',
    title: 'Преданный фанат',
    matchGenres: ['fantasy', 'romance', 'young_adult', 'thriller', 'manga', 'science_fiction'],
    accent: '#ff9f8f',
    glow: 'rgba(255,159,143,.28)',
    mood: 'Погружение',
    description: 'Когда история попадает в точку, ты идешь в нее глубоко и надолго.',
  },
];

const GENRE_ALIASES = {
  darkacademia: 'dark_academia',
  historicalfiction: 'historical_fiction',
  literaryfiction: 'literary_fiction',
  paranormalromance: 'paranormal_romance',
  sciencefiction: 'science_fiction',
  selfhelp: 'self_help',
  sliceoflife: 'slice_of_life',
  urbanfantasy: 'urban_fantasy',
  womenfiction: 'women_fiction',
  youngadult: 'young_adult',
};

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const result = {};
  const content = fs.readFileSync(filePath, 'utf8');
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#') || !line.includes('=')) continue;
    const [key, ...rest] = line.split('=');
    result[key.trim()] = rest.join('=').trim();
  }
  return result;
}

function getConfig() {
  const webEnv = parseEnvFile(path.resolve(__dirname, '../.env'));
  return {
    supabaseUrl:
      process.env.SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      webEnv.SUPABASE_URL ||
      webEnv.NEXT_PUBLIC_SUPABASE_URL ||
      '',
    serviceRoleKey:
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      webEnv.SUPABASE_SERVICE_ROLE_KEY ||
      '',
  };
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new Error(payload?.message || payload?.msg || payload?.error_description || `Request failed with ${response.status}`);
  }
  return payload;
}

function headers(serviceRoleKey) {
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    'Content-Type': 'application/json',
  };
}

async function listAuthUsers(config) {
  const result = [];
  for (let page = 1; page <= 10; page += 1) {
    const payload = await requestJson(`${config.supabaseUrl}/auth/v1/admin/users?page=${page}&per_page=200`, {
      headers: headers(config.serviceRoleKey),
    });
    const users = Array.isArray(payload?.users) ? payload.users : [];
    result.push(...users);
    if (users.length < 200) break;
  }
  return result;
}

async function selectTable(config, table, query) {
  const url = new URL(`/rest/v1/${table}`, config.supabaseUrl);
  Object.entries(query || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  return requestJson(url.toString(), {
    headers: headers(config.serviceRoleKey),
  });
}

function topEntries(counts, limit = 6) {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([value, count]) => ({ value, count }));
}

function formatDisplayName(user) {
  return user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Читатель';
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeGenreKey(value) {
  const normalized = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[\/-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/[^a-z0-9 ]/g, '')
    .trim()
    .replace(/\s+/g, '_');
  return GENRE_ALIASES[normalized] || normalized;
}

function toRuGenreLabel(value) {
  const key = normalizeGenreKey(value);
  if (!key) return '';
  if (GENRE_LABELS_RU[key]) return GENRE_LABELS_RU[key];

  return key
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function buildBookGenreLabel(book) {
  const genres = Array.isArray(book?.genres) ? book.genres : [];
  const firstGenre = genres.find((genre) => String(genre || '').trim());
  return toRuGenreLabel(firstGenre || 'fiction');
}

function collectGenreCounts(books) {
  const counts = {};
  for (const book of books) {
    const genres = Array.isArray(book?.genres) ? book.genres : [];
    for (const genre of genres) {
      const key = normalizeGenreKey(genre);
      if (!key) continue;
      counts[key] = (counts[key] || 0) + 1;
    }
  }
  return counts;
}

function uniqueById(items) {
  const seen = new Set();
  return items.filter((item) => {
    const id = String(item?.id || '');
    if (!id || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

function scoreReaderType(topGenres, libraryCount) {
  const dominantGenre = topGenres[0]?.value || '';
  const dominantShare = topGenres.length
    ? topGenres[0].count / topGenres.reduce((sum, item) => sum + item.count, 0)
    : 0;

  if (topGenres.length >= 5) {
    const explorer = READER_TYPES.find((item) => item.code === 'explorer');
    if (explorer) return explorer;
  }

  if (dominantShare >= 0.5 && libraryCount >= 10) {
    const loyal = READER_TYPES.find((item) => item.code === 'loyal_fan');
    if (loyal && loyal.matchGenres.includes(dominantGenre)) return loyal;
  }

  let bestType = READER_TYPES[0];
  let bestScore = -1;
  for (const type of READER_TYPES) {
    const score = topGenres.reduce((sum, item, index) => {
      const weight = Math.max(1, 5 - index);
      return sum + (type.matchGenres.includes(item.value) ? item.count + weight : 0);
    }, 0);
    if (score > bestScore) {
      bestScore = score;
      bestType = type;
    }
  }

  return bestType;
}

function inferReaderType(homeUserBooks, booksById) {
  const genreCounts = {};
  for (const entry of homeUserBooks) {
    const book = booksById.get(String(entry.book_id));
    if (!book) continue;
    const genres = Array.isArray(book.genres) ? book.genres : [];
    for (const genre of genres) {
      const key = normalizeGenreKey(genre);
      if (!key) continue;
      genreCounts[key] = (genreCounts[key] || 0) + 1;
    }
  }

  const topGenres = topEntries(genreCounts, 5);
  const type = scoreReaderType(topGenres, homeUserBooks.length);
  return {
    ...type,
    topGenres,
  };
}

function truncate(value, max) {
  const text = String(value || '').trim();
  if (text.length <= max) return text;
  return `${text.slice(0, Math.max(0, max - 1)).trim()}…`;
}

function escapeXml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildFallbackCoverSvg(book) {
  const title = truncate(book?.title || 'Без названия', 26);
  const author = truncate(book?.author || '', 22);
  const genre = truncate(buildBookGenreLabel(book), 20);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 460">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#171d1a"/>
          <stop offset="52%" stop-color="#31403a"/>
          <stop offset="100%" stop-color="#cda17d"/>
        </linearGradient>
      </defs>
      <rect width="320" height="460" rx="26" fill="url(#g)"/>
      <circle cx="254" cy="88" r="84" fill="rgba(255,255,255,.10)"/>
      <circle cx="74" cy="398" r="98" fill="rgba(255,255,255,.08)"/>
      <rect x="26" y="28" width="122" height="34" rx="17" fill="rgba(247,242,234,.16)"/>
      <text x="87" y="50" fill="#f7f2ea" font-size="16" font-family="Arial, sans-serif" text-anchor="middle">${escapeXml(genre)}</text>
      <text x="26" y="278" fill="#f7f2ea" font-size="31" font-weight="700" font-family="Arial, sans-serif">${escapeXml(title)}</text>
      <text x="26" y="316" fill="rgba(247,242,234,.78)" font-size="20" font-family="Arial, sans-serif">${escapeXml(author)}</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function getCoverUrl(book, placeholderCover) {
  return book?.cover_url || buildFallbackCoverSvg(book) || placeholderCover;
}

function buildOnboardingHtml(data) {
  const genreChips = data.genres
    .map((genre, index) => `<button class="chip ${index < 4 ? 'selected' : ''}">${escapeHtml(toRuGenreLabel(genre.value))}</button>`)
    .join('');

  const bookCards = data.books
    .map((book, index) => {
      const isSelected = index < 12;
      return `
        <article class="book-card ${isSelected ? 'selected' : ''}">
          <img src="${escapeHtml(getCoverUrl(book, data.placeholderCover))}" alt="${escapeHtml(book.title)}" class="book-cover" />
          <div class="book-meta">
            <div class="genre-pill">${escapeHtml(buildBookGenreLabel(book))}</div>
          </div>
          ${isSelected ? '<div class="check">✓</div>' : ''}
        </article>
      `;
    })
    .join('');

  return `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>kailauz onboarding preview</title>
  <style>
    :root{
      --bg:#0f1110;
      --surface:#171a18;
      --surface-2:#1e221f;
      --text:#f7f2ea;
      --muted:#b2aaa0;
      --stroke:rgba(255,255,255,.08);
      --peach:#f0d8c0;
      --sage:#c8d6c5;
      --rose:#e7c1c9;
      --gold:#dfc488;
      --selected:#f6ebdf;
      --selected-text:#181512;
      --shadow:0 24px 80px rgba(0,0,0,.38);
    }
    *{box-sizing:border-box}
    body{
      margin:0;
      min-height:100vh;
      background:
        radial-gradient(circle at 15% 10%, rgba(223,196,136,.10), transparent 28%),
        radial-gradient(circle at 80% 8%, rgba(231,193,201,.12), transparent 24%),
        linear-gradient(180deg,#0d0f0e 0%,#121513 100%);
      font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Avenir Next",sans-serif;
      color:var(--text);
      display:flex;
      justify-content:center;
      padding:24px;
    }
    .phone{
      width:390px;
      min-height:844px;
      border-radius:44px;
      overflow:hidden;
      background:
        radial-gradient(circle at top left, rgba(200,214,197,.15), transparent 28%),
        radial-gradient(circle at top right, rgba(240,216,192,.14), transparent 22%),
        var(--bg);
      border:1px solid rgba(255,255,255,.06);
      box-shadow:var(--shadow);
    }
    .screen{padding:22px 16px 24px}
    .status-bar{
      display:flex;
      justify-content:space-between;
      align-items:center;
      color:#dfd6cd;
      font-size:13px;
      padding:2px 6px 18px;
      opacity:.88;
    }
    .hero{
      padding:6px 6px 18px;
      display:grid;
      gap:14px;
    }
    .kicker{
      display:inline-flex;
      width:max-content;
      align-items:center;
      gap:8px;
      padding:9px 12px;
      border-radius:999px;
      background:rgba(255,255,255,.05);
      border:1px solid var(--stroke);
      font-size:12px;
      color:#efe6dc;
    }
    h1{
      margin:0;
      max-width:270px;
      font-size:38px;
      line-height:.95;
      letter-spacing:-1.4px;
      font-weight:800;
    }
    .cover-strip{
      display:grid;
      grid-template-columns:repeat(4,1fr);
      gap:8px;
    }
    .cover-strip img{
      width:100%;
      aspect-ratio:.72/1;
      border-radius:18px;
      object-fit:cover;
      background:#2a2d2b;
      box-shadow:0 12px 24px rgba(0,0,0,.24);
    }
    .section{
      margin-top:16px;
      padding:18px;
      border-radius:28px;
      background:rgba(255,255,255,.035);
      border:1px solid rgba(255,255,255,.07);
      backdrop-filter:blur(10px);
    }
    .section-top{
      display:flex;
      justify-content:space-between;
      align-items:flex-end;
      gap:10px;
      margin-bottom:14px;
    }
    .step{
      font-size:12px;
      color:var(--muted);
      margin-bottom:6px;
    }
    .title{
      font-size:24px;
      line-height:.98;
      letter-spacing:-.8px;
      font-weight:800;
    }
    .count{
      color:#f1e6db;
      font-size:13px;
      padding-bottom:3px;
      white-space:nowrap;
    }
    .chips{
      display:flex;
      flex-wrap:wrap;
      gap:10px;
    }
    .chip{
      border:none;
      padding:12px 16px;
      border-radius:999px;
      background:rgba(255,255,255,.06);
      color:var(--text);
      font-size:14px;
      letter-spacing:-.2px;
    }
    .chip.selected{
      background:var(--selected);
      color:var(--selected-text);
      box-shadow:0 10px 30px rgba(246,235,223,.15);
    }
    .books{
      display:grid;
      grid-template-columns:repeat(3,minmax(0,1fr));
      gap:10px;
      max-height:520px;
      overflow:hidden;
      position:relative;
    }
    .books:after{
      content:"";
      position:absolute;
      left:0;
      right:0;
      bottom:0;
      height:88px;
      background:linear-gradient(180deg,rgba(15,17,16,0),rgba(15,17,16,.96));
      pointer-events:none;
    }
    .book-card{
      position:relative;
      border-radius:22px;
      overflow:hidden;
      background:#222522;
      min-height:170px;
      border:1px solid transparent;
    }
    .book-card.selected{
      border-color:rgba(246,235,223,.55);
      box-shadow:0 16px 34px rgba(0,0,0,.24);
    }
    .book-cover{
      width:100%;
      height:100%;
      display:block;
      object-fit:cover;
      aspect-ratio:.72/1;
    }
    .book-meta{
      position:absolute;
      left:8px;
      right:8px;
      bottom:8px;
      display:flex;
      justify-content:flex-start;
    }
    .genre-pill{
      display:inline-flex;
      align-items:center;
      min-height:24px;
      padding:6px 10px;
      border-radius:999px;
      background:rgba(15,17,16,.72);
      backdrop-filter:blur(10px);
      font-size:11px;
      color:#f8efe8;
    }
    .check{
      position:absolute;
      top:8px;
      right:8px;
      width:28px;
      height:28px;
      border-radius:50%;
      background:var(--selected);
      color:#181512;
      display:flex;
      align-items:center;
      justify-content:center;
      font-weight:800;
      box-shadow:0 8px 20px rgba(0,0,0,.25);
    }
    .cta-wrap{
      position:sticky;
      bottom:0;
      margin-top:16px;
      padding-top:10px;
      background:linear-gradient(180deg,rgba(15,17,16,0),#0f1110 28%);
    }
    .cta{
      width:100%;
      min-height:58px;
      border:none;
      border-radius:20px;
      background:linear-gradient(135deg,var(--peach),#f4e7d7);
      color:#171310;
      font-size:16px;
      font-weight:800;
      letter-spacing:-.2px;
      box-shadow:0 18px 44px rgba(240,216,192,.16);
    }
    .dots{
      display:flex;
      justify-content:center;
      gap:8px;
      margin-top:12px;
    }
    .dot{
      width:8px;
      height:8px;
      border-radius:50%;
      background:rgba(255,255,255,.16);
    }
    .dot.active{background:var(--peach)}
  </style>
</head>
<body>
  <main class="phone">
    <section class="screen">
      <div class="status-bar"><span>9:41</span><span>5G</span></div>
      <div class="hero">
        <div class="kicker">kailauz</div>
        <h1>Собираем твой вкус</h1>
        <div class="cover-strip">
          ${data.books.slice(0, 4).map((book) => `<img src="${escapeHtml(getCoverUrl(book, data.placeholderCover))}" alt="${escapeHtml(book.title)}" />`).join('')}
        </div>
      </div>

      <div class="section">
        <div class="section-top">
          <div>
            <div class="step">1 / 2</div>
            <div class="title">Жанры</div>
          </div>
          <div class="count">3–5</div>
        </div>
        <div class="chips">${genreChips}</div>
      </div>

      <div class="section">
        <div class="section-top">
          <div>
            <div class="step">2 / 2</div>
            <div class="title">Книги</div>
          </div>
          <div class="count">12 / 10</div>
        </div>
        <div class="books">${bookCards}</div>
      </div>

      <div class="cta-wrap">
        <button class="cta">Показать мой тип</button>
        <div class="dots"><span class="dot active"></span><span class="dot active"></span></div>
      </div>
    </section>
  </main>
</body>
</html>`;
}

function buildHomeHtml(data) {
  const heroCovers = data.heroBooks
    .map((book) => `<img src="${escapeHtml(getCoverUrl(book, data.placeholderCover))}" alt="${escapeHtml(book.title)}" />`)
    .join('');

  const currentReading = data.currentReading
    .map((item) => `
      <article class="reading-card">
        <img src="${escapeHtml(getCoverUrl(item, data.placeholderCover))}" alt="${escapeHtml(item.title)}" />
        <div class="reading-body">
          <div class="reading-title">${escapeHtml(truncate(item.title, 44))}</div>
          <div class="reading-author">${escapeHtml(truncate(item.author || '', 34))}</div>
          <div class="progress"><div style="width:${Math.max(8, item.progress_percent || 12)}%"></div></div>
        </div>
      </article>
    `)
    .join('');

  const shelfStrip = data.shelfBooks
    .map((book) => `
      <article class="shelf-card">
        <img src="${escapeHtml(getCoverUrl(book, data.placeholderCover))}" alt="${escapeHtml(book.title)}" />
      </article>
    `)
    .join('');

  const recommendations = data.recommendations
    .map((book) => `
      <article class="rec-card">
        <img src="${escapeHtml(getCoverUrl(book, data.placeholderCover))}" alt="${escapeHtml(book.title)}" />
        <div class="rec-shade"></div>
        <div class="rec-content">
          <div class="rec-genre">${escapeHtml(buildBookGenreLabel(book))}</div>
          <div class="rec-title">${escapeHtml(truncate(book.title, 44))}</div>
        </div>
      </article>
    `)
    .join('');

  return `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>kailauz home preview</title>
  <style>
    :root{
      --bg:#0f1110;
      --surface:#161917;
      --surface-2:#1f2421;
      --text:#f8f2e9;
      --muted:#b4aca1;
      --stroke:rgba(255,255,255,.08);
      --peach:#f0d8c0;
      --sage:#c8d6c5;
      --rose:#e7c1c9;
      --gold:#dfc488;
      --shadow:0 24px 80px rgba(0,0,0,.38);
    }
    *{box-sizing:border-box}
    body{
      margin:0;
      min-height:100vh;
      background:
        radial-gradient(circle at 12% 8%, rgba(200,214,197,.14), transparent 24%),
        radial-gradient(circle at 85% 6%, ${escapeHtml(data.readerType.glow)}, transparent 22%),
        linear-gradient(180deg,#0c0f0d 0%,#121513 100%);
      font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Avenir Next",sans-serif;
      color:var(--text);
      display:flex;
      justify-content:center;
      padding:24px;
    }
    .phone{
      width:390px;
      min-height:844px;
      border-radius:44px;
      overflow:hidden;
      background:
        radial-gradient(circle at top left, rgba(240,216,192,.14), transparent 26%),
        radial-gradient(circle at top right, ${escapeHtml(data.readerType.glow)}, transparent 28%),
        var(--bg);
      border:1px solid rgba(255,255,255,.06);
      box-shadow:var(--shadow);
    }
    .screen{padding:22px 16px 34px}
    .status-bar{
      display:flex;
      justify-content:space-between;
      align-items:center;
      color:#dfd6cd;
      font-size:13px;
      padding:2px 6px 18px;
      opacity:.88;
    }
    .hero{
      position:relative;
      padding:6px 6px 0;
    }
    .top-row{
      display:flex;
      justify-content:space-between;
      align-items:flex-start;
      gap:12px;
    }
    .hello{
      color:var(--muted);
      font-size:13px;
      margin-bottom:8px;
    }
    h1{
      margin:0;
      font-size:36px;
      line-height:.95;
      letter-spacing:-1.4px;
      font-weight:800;
      max-width:220px;
    }
    .hero-chip{
      display:inline-flex;
      align-items:center;
      justify-content:center;
      min-width:62px;
      height:62px;
      padding:0 16px;
      border-radius:22px;
      background:rgba(255,255,255,.06);
      border:1px solid var(--stroke);
      color:${escapeHtml(data.readerType.accent)};
      font-size:12px;
      font-weight:800;
      text-align:center;
    }
    .hero-panel{
      margin-top:16px;
      padding:18px;
      border-radius:30px;
      background:linear-gradient(135deg,rgba(255,255,255,.06),rgba(255,255,255,.03));
      border:1px solid rgba(255,255,255,.08);
      overflow:hidden;
      position:relative;
    }
    .hero-panel:before{
      content:"";
      position:absolute;
      width:180px;
      height:180px;
      right:-44px;
      top:-70px;
      border-radius:50%;
      background:${escapeHtml(data.readerType.glow)};
      filter:blur(12px);
      opacity:.8;
    }
    .type-kicker{
      position:relative;
      display:inline-flex;
      padding:8px 12px;
      border-radius:999px;
      background:rgba(255,255,255,.08);
      font-size:12px;
      color:#f4ebe2;
    }
    .type-title{
      position:relative;
      margin-top:12px;
      font-size:28px;
      line-height:.96;
      letter-spacing:-1px;
      font-weight:800;
      max-width:210px;
    }
    .type-text{
      position:relative;
      margin-top:10px;
      color:#ddd4ca;
      font-size:13px;
      line-height:1.4;
      max-width:210px;
    }
    .hero-covers{
      position:relative;
      margin-top:18px;
      display:grid;
      grid-template-columns:repeat(4,1fr);
      gap:8px;
    }
    .hero-covers img{
      width:100%;
      aspect-ratio:.72/1;
      border-radius:18px;
      object-fit:cover;
      background:#272b28;
      box-shadow:0 10px 24px rgba(0,0,0,.18);
    }
    .stats{
      display:grid;
      grid-template-columns:repeat(3,1fr);
      gap:10px;
      margin-top:16px;
    }
    .stat{
      min-height:82px;
      padding:14px 12px;
      border-radius:22px;
      background:rgba(255,255,255,.04);
      border:1px solid rgba(255,255,255,.06);
    }
    .stat-value{
      font-size:24px;
      line-height:1;
      font-weight:800;
    }
    .stat-label{
      margin-top:6px;
      color:var(--muted);
      font-size:12px;
    }
    .section{
      margin-top:16px;
      padding:18px;
      border-radius:28px;
      background:rgba(255,255,255,.035);
      border:1px solid rgba(255,255,255,.07);
    }
    .section-top{
      display:flex;
      justify-content:space-between;
      align-items:flex-end;
      gap:10px;
      margin-bottom:14px;
    }
    .section-title{
      font-size:22px;
      line-height:.98;
      letter-spacing:-.8px;
      font-weight:800;
    }
    .section-side{
      color:var(--muted);
      font-size:12px;
      white-space:nowrap;
    }
    .reading-list{
      display:grid;
      gap:10px;
    }
    .reading-card{
      display:grid;
      grid-template-columns:78px 1fr;
      gap:12px;
      align-items:center;
      padding:8px;
      border-radius:22px;
      background:rgba(255,255,255,.04);
      border:1px solid rgba(255,255,255,.05);
    }
    .reading-card img{
      width:78px;
      height:110px;
      object-fit:cover;
      border-radius:16px;
      background:#272b28;
    }
    .reading-title{
      font-size:15px;
      line-height:1.2;
      font-weight:700;
    }
    .reading-author{
      margin-top:5px;
      color:var(--muted);
      font-size:12px;
    }
    .progress{
      margin-top:16px;
      height:8px;
      border-radius:999px;
      background:rgba(255,255,255,.08);
      overflow:hidden;
    }
    .progress div{
      height:100%;
      border-radius:999px;
      background:linear-gradient(90deg,var(--peach),${escapeHtml(data.readerType.accent)});
    }
    .shelf-strip,.rec-grid{
      display:flex;
      gap:10px;
      overflow:hidden;
    }
    .shelf-card{
      min-width:96px;
      border-radius:20px;
      overflow:hidden;
      background:#252926;
    }
    .shelf-card img{
      width:96px;
      height:136px;
      object-fit:cover;
      display:block;
    }
    .rec-card{
      min-width:180px;
      height:244px;
      position:relative;
      border-radius:24px;
      overflow:hidden;
      background:#252926;
      border:1px solid rgba(255,255,255,.06);
    }
    .rec-card img{
      width:100%;
      height:100%;
      object-fit:cover;
      display:block;
    }
    .rec-shade{
      position:absolute;
      inset:0;
      background:linear-gradient(180deg,rgba(0,0,0,.04) 16%,rgba(10,12,11,.88) 100%);
    }
    .rec-content{
      position:absolute;
      left:14px;
      right:14px;
      bottom:14px;
    }
    .rec-genre{
      font-size:11px;
      color:#f3e7db;
    }
    .rec-title{
      margin-top:8px;
      font-size:18px;
      line-height:1.02;
      font-weight:800;
    }
    .nav{
      margin-top:18px;
      display:grid;
      grid-template-columns:repeat(4,1fr);
      gap:8px;
      padding:10px;
      border-radius:24px;
      background:rgba(255,255,255,.04);
      border:1px solid rgba(255,255,255,.06);
    }
    .nav-item{
      min-height:56px;
      border-radius:18px;
      display:grid;
      place-items:center;
      gap:4px;
      align-content:center;
      color:var(--muted);
      font-size:11px;
    }
    .nav-item.active{
      background:rgba(255,255,255,.08);
      color:#f7f0e8;
    }
  </style>
</head>
<body>
  <main class="phone">
    <section class="screen">
      <div class="status-bar"><span>9:41</span><span>5G</span></div>
      <div class="hero">
        <div class="top-row">
          <div>
            <div class="hello">Твой дом чтения</div>
            <h1>${escapeHtml(data.displayName)}</h1>
          </div>
          <div class="hero-chip">${escapeHtml(data.readerType.mood)}</div>
        </div>
        <div class="hero-panel">
          <div class="type-kicker">Твой тип</div>
          <div class="type-title">${escapeHtml(data.readerType.title)}</div>
          <div class="type-text">${escapeHtml(data.readerType.description)}</div>
          <div class="hero-covers">${heroCovers}</div>
        </div>
        <div class="stats">
          <div class="stat"><div class="stat-value">${escapeHtml(String(data.totalBooks))}</div><div class="stat-label">книг</div></div>
          <div class="stat"><div class="stat-value">${escapeHtml(String(data.readCount))}</div><div class="stat-label">прочитано</div></div>
          <div class="stat"><div class="stat-value">${escapeHtml(String(data.averageRating || '0.0'))}</div><div class="stat-label">средняя</div></div>
        </div>
      </div>

      <div class="section">
        <div class="section-top">
          <div class="section-title">Сейчас</div>
          <div class="section-side">${escapeHtml(String(data.currentReading.length))}</div>
        </div>
        <div class="reading-list">${currentReading}</div>
      </div>

      <div class="section">
        <div class="section-top">
          <div class="section-title">Полка</div>
          <div class="section-side">${escapeHtml(String(data.shelfBooks.length))}</div>
        </div>
        <div class="shelf-strip">${shelfStrip}</div>
      </div>

      <div class="section">
        <div class="section-top">
          <div class="section-title">Для тебя</div>
          <div class="section-side">${escapeHtml(data.readerType.title)}</div>
        </div>
        <div class="rec-grid">${recommendations}</div>
      </div>

      <div class="nav">
        <div class="nav-item active"><div>⌂</div><div>Дом</div></div>
        <div class="nav-item"><div>☰</div><div>Полка</div></div>
        <div class="nav-item"><div>✦</div><div>Подборки</div></div>
        <div class="nav-item"><div>◌</div><div>Профиль</div></div>
      </div>
    </section>
  </main>
</body>
</html>`;
}

async function main() {
  const config = getConfig();
  if (!config.supabaseUrl || !config.serviceRoleKey) {
    throw new Error('Missing Supabase env for preview generator');
  }

  const authUsers = await listAuthUsers(config);
  const demoUsers = authUsers.filter((user) => DEMO_USERS.includes(String(user.id)));
  const userIds = demoUsers.map((user) => String(user.id));

  const [readerProfiles, userBooks, catalogBooks] = await Promise.all([
    selectTable(config, 'reader_profiles', {
      select: '*',
      user_id: `in.(${userIds.join(',')})`,
    }),
    selectTable(config, 'user_books', {
      select: 'user_id,book_id,status,rating,started_at,finished_at,progress_percent,updated_at,comment,notes',
      user_id: `in.(${userIds.join(',')})`,
      order: 'updated_at.desc.nullslast',
    }),
    selectTable(config, 'books', {
      select: 'id,title,author,genres,cover_url,page_count,description,publishers',
      order: 'title.asc',
      limit: 800,
    }),
  ]);

  const relatedBookIds = [...new Set(userBooks.map((item) => String(item.book_id)).filter(Boolean))];
  const relatedBooks = relatedBookIds.length
    ? await selectTable(config, 'books', {
        select: 'id,title,author,genres,cover_url,page_count,description,publishers',
        id: `in.(${relatedBookIds.join(',')})`,
      })
    : [];

  const allBooks = uniqueById([...catalogBooks, ...relatedBooks]);
  const booksById = new Map(allBooks.map((book) => [String(book.id), book]));
  const profilesByUserId = new Map(readerProfiles.map((profile) => [String(profile.user_id), profile]));

  const onboardingGenreCounts = collectGenreCounts(allBooks);
  const topGenres = topEntries(onboardingGenreCounts, 10);
  const selectedGenres = topGenres.slice(0, 5);

  const onboardingBooks = [];
  for (const genre of selectedGenres.map((item) => item.value)) {
    const matches = allBooks.filter((book) =>
      Array.isArray(book.genres) && book.genres.some((value) => normalizeGenreKey(value) === genre),
    );
    for (const match of matches) {
      if (onboardingBooks.length >= 30) break;
      if (!onboardingBooks.find((item) => String(item.id) === String(match.id))) {
        onboardingBooks.push(match);
      }
    }
  }
  for (const book of allBooks) {
    if (onboardingBooks.length >= 30) break;
    if (!onboardingBooks.find((item) => String(item.id) === String(book.id))) {
      onboardingBooks.push(book);
    }
  }

  const homeUser = demoUsers.find((user) => String(user.email).startsWith('anna@')) || demoUsers[0];
  const homeProfile = profilesByUserId.get(String(homeUser?.id || '')) || {};
  const homeUserBooks = userBooks.filter((item) => String(item.user_id) === String(homeUser?.id || ''));
  const homeReaderType = inferReaderType(homeUserBooks, booksById);

  const currentReading = homeUserBooks
    .filter((item) => String(item.status) === 'reading')
    .slice(0, 3)
    .map((item) => {
      const book = booksById.get(String(item.book_id)) || {};
      return {
        title: book.title || 'Без названия',
        author: book.author || '',
        cover_url: book.cover_url || '',
        progress_percent: Number(item.progress_percent || 0),
      };
    });

  const fallbackReading = allBooks.slice(0, 2).map((book, index) => ({
    title: book.title || 'Без названия',
    author: book.author || '',
    cover_url: book.cover_url || '',
    progress_percent: 18 + (index * 21),
  }));

  const readEntries = homeUserBooks.filter((item) => String(item.status) === 'read');
  const ratingValues = homeUserBooks.map((item) => Number(item.rating || 0)).filter((value) => value > 0);
  const averageRating = ratingValues.length
    ? (ratingValues.reduce((sum, value) => sum + value, 0) / ratingValues.length).toFixed(1)
    : null;

  const topGenreSet = new Set(homeReaderType.topGenres.map((item) => item.value));
  const recommendationBooks = allBooks
    .filter((book) => !homeUserBooks.find((entry) => String(entry.book_id) === String(book.id)))
    .filter((book) => Array.isArray(book.genres) && book.genres.some((genre) => topGenreSet.has(normalizeGenreKey(genre))))
    .slice(0, 4);

  const shelfBooks = homeUserBooks
    .slice(0, 6)
    .map((entry) => booksById.get(String(entry.book_id)))
    .filter(Boolean)
    .slice(0, 6);

  const heroBooks = uniqueById([
    ...shelfBooks,
    ...(currentReading.length ? currentReading : fallbackReading),
    ...recommendationBooks,
  ]).slice(0, 4);

  const placeholderCover = 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80';
  const outputDir = path.resolve(__dirname, '../public/previews');
  fs.mkdirSync(outputDir, { recursive: true });

  const onboardingHtml = buildOnboardingHtml({
    genres: selectedGenres,
    books: onboardingBooks,
    placeholderCover,
  });

  const homeHtml = buildHomeHtml({
    displayName: formatDisplayName(homeUser || {}),
    profileSummary: String(homeProfile?.profile_summary || '').trim(),
    totalBooks: homeUserBooks.length,
    readCount: readEntries.length,
    averageRating,
    currentReading: currentReading.length ? currentReading : fallbackReading,
    heroBooks,
    shelfBooks: shelfBooks.length ? shelfBooks : allBooks.slice(0, 6),
    recommendations: recommendationBooks.length ? recommendationBooks : allBooks.slice(6, 10),
    readerType: homeReaderType,
    placeholderCover,
  });

  fs.writeFileSync(path.join(outputDir, 'onboarding-books.html'), onboardingHtml);
  fs.writeFileSync(path.join(outputDir, 'home.html'), homeHtml);

  console.log(JSON.stringify({
    output_dir: outputDir,
    files: [
      path.join(outputDir, 'onboarding-books.html'),
      path.join(outputDir, 'home.html'),
    ],
    source_user_for_home: homeUser
      ? {
          id: homeUser.id,
          email: homeUser.email,
          display_name: formatDisplayName(homeUser),
        }
      : null,
    onboarding_genres: selectedGenres,
    reader_type_preview: homeReaderType.title,
  }, null, 2));
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
