import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const required = [
  'index.html','offline.html','manifest.webmanifest','service-worker.js',
  'assets/styles.css','assets/release002.css','assets/app.js','assets/favicon.svg','assets/fallback.css',
  'src/worker.js','wrangler.jsonc','_headers','_redirects'
];

for (const file of required) {
  if (!existsSync(new URL(`../${file}`, import.meta.url))) throw new Error(`Missing required file: ${file}`);
}

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
for (const marker of ['<main','manifest.webmanifest','assets/styles.css','assets/release002.css','assets/app.js','Sakthi AI Nexus','/api/v1/chat','Release 002']) {
  if (!html.includes(marker)) throw new Error(`index.html missing marker: ${marker}`);
}

const worker = await readFile(new URL('../src/worker.js', import.meta.url), 'utf8');
for (const marker of ['/api/v1/status','/api/v1/chat','env.AI.run','SAKTHI_CHAT_RATE_LIMIT']) {
  if (!worker.includes(marker)) throw new Error(`src/worker.js missing marker: ${marker}`);
}

const combined = `${html}\n${worker}`;
if (/sk-[A-Za-z0-9]{20,}|AIza[A-Za-z0-9_-]{20,}/.test(combined)) throw new Error('Potential API key found in source files');

const manifest = JSON.parse(await readFile(new URL('../manifest.webmanifest', import.meta.url), 'utf8'));
if (manifest.name !== 'Sakthi AI Nexus' || manifest.display !== 'standalone') throw new Error('Invalid PWA manifest');

const wrangler = JSON.parse((await readFile(new URL('../wrangler.jsonc', import.meta.url), 'utf8')).replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, ''));
if (wrangler.main !== 'src/worker.js' || wrangler.assets?.directory !== './dist' || wrangler.ai?.binding !== 'AI') {
  throw new Error('Invalid Release 002 Wrangler configuration');
}

console.log('Validation passed: Release 002 UI, PWA, Worker API, AI binding and basic secret checks.');
