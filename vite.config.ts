import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

function palukuServiceWorker(): Plugin {
  return {
    name: 'paluku-service-worker',
    apply: 'build',
    async closeBundle() {
      const outDir = resolve(process.cwd(), 'dist');
      const html = await readFile(resolve(outDir, 'index.html'), 'utf8');
      const assets = Array.from(html.matchAll(/(?:src|href)="([^\"]+\.(?:js|css)(?:\?[^\"]*)?)"/g), match => match[1])
        .filter(asset => asset.startsWith('/'));
      const cacheName = 'paluku-' + (process.env.GITHUB_SHA?.slice(0, 8) || Date.now());
      const precache = ['SHELL', "new URL('manifest.webmanifest', self.registration.scope).pathname", "new URL('paluku.svg', self.registration.scope).pathname", ...assets.map(asset => JSON.stringify(asset))].join(', ');
      const worker = [
        'const CACHE = ' + JSON.stringify(cacheName) + ';',
        "const SHELL = new URL('.', self.registration.scope).pathname;",
        'const PRECACHE = [' + precache + '];',
        "self.addEventListener('install', event => event.waitUntil((async () => { const cache = await caches.open(CACHE); await cache.addAll(PRECACHE); await self.skipWaiting(); })()));",
        "self.addEventListener('activate', event => event.waitUntil((async () => { const keys = await caches.keys(); await Promise.all(keys.filter(key => key.startsWith('paluku-') && key !== CACHE).map(key => caches.delete(key))); await self.clients.claim(); })()));",
        "self.addEventListener('fetch', event => { const request = event.request; if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return; if (request.mode === 'navigate') { event.respondWith((async () => { try { const response = await fetch(request); if (response.ok) { const cache = await caches.open(CACHE); await cache.put(SHELL, response.clone()); } return response; } catch { return (await caches.match(SHELL)) || Response.error(); } })()); return; } event.respondWith((async () => { const cached = await caches.match(request); if (cached) return cached; try { const response = await fetch(request); if (response.ok && new URL(request.url).pathname.startsWith(SHELL)) { const cache = await caches.open(CACHE); await cache.put(request, response.clone()); } return response; } catch { return cached || Response.error(); } })()); });"
      ].join('\n');
      await writeFile(resolve(outDir, 'sw.js'), worker, 'utf8');
    }
  };
}

export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react(), palukuServiceWorker()]
});
