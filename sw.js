
const CACHE = 'site-23385936-0e70-4858-95e7-e577305a257b-v1';
const ASSETS = ["index.html","manifest.webmanifest","manifest.json","apple-touch-icon.png","icon-192.png","icon-512.png","assets/index--C9z9XXz.js","assets/index-lcXToBJO.css","~flock.js"];
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => Promise.allSettled(ASSETS.map((a) => c.add(a)))));
});
self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(req, { ignoreSearch: true });
    const network = fetch(req).then((res) => {
      if (res && res.status === 200) cache.put(req, res.clone());
      return res;
    }).catch(() => null);
    if (cached) { network; return cached; }
    const res = await network;
    if (res) return res;
    const fallback = await cache.match('index.html', { ignoreSearch: true });
    return fallback || new Response('offline', { status: 503 });
  })());
});
