import { PLATFORMS } from './platforms.js';
import { HTML } from './html.js';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
const J = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });

// best-effort per-IP rate limit (per isolate, not global - documented in README)
const buckets = new Map();
function rateLimited(ip) {
  const now = Date.now(), win = 60_000, max = 12;
  const b = buckets.get(ip) || [];
  const fresh = b.filter(t => now - t < win);
  if (fresh.length >= max) { buckets.set(ip, fresh); return true; }
  fresh.push(now); buckets.set(ip, fresh); return false;
}

async function checkOne(p, username) {
  const enc = encodeURIComponent(username);
  const target = p.url(enc);
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(target, {
      method: 'GET',
      redirect: 'follow',
      signal: ctrl.signal,
      headers: { 'user-agent': UA, 'accept': 'text/html,application/json,*/*', 'accept-language': 'en-US,en;q=0.9' },
    });
    const st = res.status;
    let status, confidence;
    if (p.method === 'json-array') {
      const body = await res.text();
      let arr = null;
      try { arr = JSON.parse(body); } catch {}
      if (res.ok && Array.isArray(arr) && arr.length > 0) { status = 'found'; confidence = 'verified'; }
      else if (res.ok && Array.isArray(arr)) { status = 'notfound'; confidence = 'verified'; }
      else if (st === 404) { status = 'notfound'; confidence = 'verified'; }
      else { status = 'unknown'; confidence = 'blocked'; }
    } else if (p.method === 'json-npm') {
      const body = await res.text();
      let obj = null;
      try { obj = JSON.parse(body); } catch {}
      if (obj && Array.isArray(obj.objects)) {
        if (obj.objects.length > 0) { status = 'found'; confidence = 'verified'; }
        else { status = 'notfound'; confidence = 'verified'; }
      } else { status = 'unknown'; confidence = 'blocked'; }
    } else if (p.method === 'json-keybase') {
      const body = await res.text();
      let obj = null;
      try { obj = JSON.parse(body); } catch {}
      if (obj && obj.status && obj.status.code === 0 && obj.them) { status = 'found'; confidence = 'verified'; }
      else { status = 'notfound'; confidence = 'verified'; }
    } else if (p.method === 'content') {
      const body = await res.text();
      if (p.blockedIf && p.blockedIf.test(body)) { status = 'unknown'; confidence = 'blocked'; }
      else if (st === 404) { status = 'notfound'; confidence = p.api ? 'verified' : 'likely'; }
      else if (p.notFound && p.notFound.test(body)) { status = 'notfound'; confidence = p.api ? 'verified' : 'likely'; }
      else if (p.found && p.found.test(body)) { status = 'found'; confidence = p.api ? 'verified' : 'likely'; }
      else if (!p.found && res.ok) { status = 'found'; confidence = p.api ? 'verified' : 'likely'; }
      else if (p.found && res.ok) { status = 'notfound'; confidence = 'likely'; }
      else { status = 'unknown'; confidence = 'blocked'; }
    } else { // status
      if (st >= 200 && st < 300) { status = 'found'; confidence = p.api ? 'verified' : (p.fragile ? 'weak' : 'likely'); }
      else if (st === 404 || st === 410) { status = 'notfound'; confidence = p.api ? 'verified' : 'likely'; }
      else if (st === 301 || st === 302 || st === 308) { status = 'found'; confidence = 'weak'; }
      else { status = 'unknown'; confidence = 'blocked'; }
    }
    return { id: p.id, name: p.name, cat: p.cat, url: p.profile(enc), site: p.site, status, confidence, http: st };
  } catch (e) {
    return { id: p.id, name: p.name, cat: p.cat, url: p.profile(enc), site: p.site, status: 'unknown', confidence: 'blocked', http: 0 };
  } finally { clearTimeout(timer); }
}

function dorkLinks(q) {
  const e = encodeURIComponent;
  const qq = `"${q}"`;
  const sites = [
    ['Google - חיפוש כללי', `https://www.google.com/search?q=${e(qq)}`],
    ['Google - Facebook', `https://www.google.com/search?q=${e('site:facebook.com ' + qq)}`],
    ['Google - Instagram', `https://www.google.com/search?q=${e('site:instagram.com ' + qq)}`],
    ['Google - TikTok', `https://www.google.com/search?q=${e('site:tiktok.com ' + qq)}`],
    ['Google - X / Twitter', `https://www.google.com/search?q=${e('site:x.com OR site:twitter.com ' + qq)}`],
    ['Google - LinkedIn', `https://www.google.com/search?q=${e('site:linkedin.com ' + qq)}`],
    ['Google - Threads', `https://www.google.com/search?q=${e('site:threads.net ' + qq)}`],
    ['Google - YouTube', `https://www.google.com/search?q=${e('site:youtube.com ' + qq)}`],
    ['Google - Reddit', `https://www.google.com/search?q=${e('site:reddit.com ' + qq)}`],
    ['Google - Telegram', `https://www.google.com/search?q=${e('site:t.me ' + qq)}`],
    ['Bing - חיפוש כללי', `https://www.bing.com/search?q=${e(qq)}`],
    ['DuckDuckGo - חיפוש כללי', `https://duckduckgo.com/?q=${e(qq)}`],
  ];
  return sites.map(([label, url]) => ({ label, url }));
}

async function contextSearch(q) {
  // Try DuckDuckGo HTML endpoint, fall back to Bing. Both are best-effort scrapes.
  const out = { engine: null, results: [] };
  const e = encodeURIComponent;
  const tries = [
    { name: 'DuckDuckGo', url: `https://html.duckduckgo.com/html/?q=${e(q)}`,
      parse: body => {
        const items = [];
        const re = /<a[^>]*class="result__a"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?(?:<a[^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/a>)?/g;
        let m;
        while ((m = re.exec(body)) && items.length < 10) {
          let href = m[1];
          const ud = href.match(/uddg=([^&]+)/);
          if (ud) href = decodeURIComponent(ud[1]);
          items.push({ title: strip(m[2]), url: href, snippet: strip(m[3] || '') });
        }
        return items;
      } },
    { name: 'Bing', url: `https://www.bing.com/search?q=${e(q)}&count=10`,
      parse: body => {
        const items = [];
        const re = /<li class="b_algo"[^>]*>[\s\S]*?<h2[^>]*>\s*<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?(?:<p[^>]*>([\s\S]*?)<\/p>)?/g;
        let m;
        while ((m = re.exec(body)) && items.length < 10) {
          items.push({ title: strip(m[2]), url: m[1], snippet: strip(m[3] || '') });
        }
        return items;
      } },
  ];
  for (const t of tries) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 8000);
      const res = await fetch(t.url, { signal: ctrl.signal, headers: { 'user-agent': UA, 'accept-language': 'en-US,en;q=0.9' } });
      clearTimeout(timer);
      if (!res.ok) continue;
      const items = t.parse(await res.text()).filter(i => i.title && i.url && i.url.startsWith('http'));
      // relevance sanity check: datacenter scrapes often get generic results that ignore
      // the query. Keep engine results only when they actually mention the query tokens.
      const toks = q.toLowerCase().split(/\s+/).filter(x => x.length >= 3).map(x => x.replace(/["']/g, ''));
      const hits = items.filter(i => {
        const hay = (i.title + ' ' + i.snippet + ' ' + i.url).toLowerCase();
        return toks.some(tk => hay.includes(tk));
      });
      if (hits.length >= 2 || (items.length <= 3 && hits.length >= 1)) { out.engine = t.name; out.results = items; return out; }
    } catch {}
  }
  return out;
}
function strip(html) {
  return (html || '').replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === '/api/username') {
      const ip = request.headers.get('cf-connecting-ip') || 'anon';
      if (rateLimited(ip + ':u')) return J({ error: 'rate limited' }, 429);
      const u = (url.searchParams.get('u') || '').trim().replace(/^@/, '');
      if (!u || u.length > 60 || !/^[\w.\-א-ת ]+$/.test(u)) return J({ error: 'bad username' }, 400);
      const results = await Promise.all(PLATFORMS.map(p => checkOne(p, u)));
      const found = results.filter(r => r.status === 'found');
      const notfound = results.filter(r => r.status === 'notfound');
      const unknown = results.filter(r => r.status === 'unknown');
      return J({ username: u, checked: results.length, found, unknown, notfound, dorks: dorkLinks(u) });
    }
    if (url.pathname === '/api/context') {
      const ip = request.headers.get('cf-connecting-ip') || 'anon';
      if (rateLimited(ip + ':c')) return J({ error: 'rate limited' }, 429);
      const q = (url.searchParams.get('q') || '').trim();
      if (!q || q.length > 200) return J({ error: 'bad query' }, 400);
      const res = await contextSearch(q);
      return J({ query: q, engine: res.engine, results: res.results, dorks: dorkLinks(q) });
    }
    if (url.pathname === '/' || url.pathname === '/index.html') {
      return new Response(HTML, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=300' } });
    }
    return new Response('not found', { status: 404 });
  },
};
