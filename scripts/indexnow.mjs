// Tells search engines that take IndexNow (Yandex, Bing and others) about every page in the sitemap,
// so they recrawl at once instead of on their own schedule. Run after a deploy that changes pages:
//   node apps/web/scripts/indexnow.mjs
// The key file public/0a3120733242b95b18e178a3f43ab151.txt proves the site is ours; it must stay deployed.
const SITE = 'https://www.kailauz.com';
const KEY = '0a3120733242b95b18e178a3f43ab151';

const sitemap = await (await fetch(`${SITE}/sitemap.xml`)).text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
if (!urls.length) throw new Error('No URLs in the sitemap');

for (const endpoint of ['https://yandex.com/indexnow', 'https://api.indexnow.org/indexnow']) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: new URL(SITE).host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList: urls }),
  });
  console.log(JSON.stringify({ endpoint, status: response.status, urls: urls.length }));
}
