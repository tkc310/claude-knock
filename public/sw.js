// オフラインでも開けるようにする Service Worker（ADR-0013）。外部ライブラリは使わない。
// VERSION（保存した中身のハッシュ）と PRECACHE（保存する URL）は、ビルドの最後に
// src/integrations/service-worker.ts が dist/sw.js へ書き込む。中身が変わると VERSION が変わり、古い保存を消す
const VERSION = '__SW_VERSION__';
const PRECACHE = /* __SW_PRECACHE__ */ [];
const PREFIX = 'thai-buddhist-calendar-';
const CACHE = PREFIX + VERSION;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k.startsWith(PREFIX) && k !== CACHE).map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  // ページと calendar.ics は、つながるときは新しい版を見せ、つながらないときに保存した版を返す
  if (request.mode === 'navigate' || url.pathname.endsWith('.ics')) {
    event.respondWith(networkFirst(request, url));
    return;
  }
  // CSS・JS・アイコンは保存した版を先に返す（_astro/ はファイル名にハッシュが入る）
  event.respondWith(cacheFirst(request));
});

async function networkFirst(request, url) {
  const cache = await caches.open(CACHE);
  try {
    const response = await fetch(request);
    if (response.ok && !response.redirected) await cache.put(request, response.clone());
    return response;
  } catch (error) {
    // /events/wan-phra のように末尾の / が無い URL も、保存した /events/wan-phra/ で返す
    const cached =
      (await cache.match(request, { ignoreSearch: true })) ??
      (await cache.match(url.pathname.replace(/\/?$/, '/'))) ??
      (request.mode === 'navigate' ? await cache.match('/') : undefined);
    if (cached) return cached;
    throw error;
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) await cache.put(request, response.clone());
  return response;
}
