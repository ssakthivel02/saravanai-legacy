import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const required = [
  'index.html','offline.html','manifest.webmanifest','service-worker.js',
  'assets/styles.css','assets/release002.css','assets/release003.css','assets/app.js','assets/favicon.svg','assets/fallback.css',
  'src/worker.js','src/router.js','wrangler.jsonc','_headers','_redirects',
  'docs/RELEASE_003_IMPLEMENTATION.md'
];

for (const file of required) {
  if (!existsSync(new URL(`../${file}`, import.meta.url))) throw new Error(`Missing required file: ${file}`);
}

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
for (const marker of ['<main','manifest.webmanifest','assets/styles.css','assets/release003.css','assets/app.js','Sakthi AI Nexus','Release 003','citationPanel','budgetSelect','streamToggle']) {
  if (!html.includes(marker)) throw new Error(`index.html missing marker: ${marker}`);
}

const worker = await readFile(new URL('../src/worker.js', import.meta.url), 'utf8');
for (const marker of ['/api/v1/status','/api/v1/chat','/api/v1/chat/stream','/api/v1/research','env.AI.run','SAKTHI_CHAT_RATE_LIMIT','FRESH_RESEARCH_UNAVAILABLE']) {
  if (!worker.includes(marker)) throw new Error(`src/worker.js missing marker: ${marker}`);
}

const router = await readFile(new URL('../src/router.js', import.meta.url), 'utf8');
for (const marker of ['0.3.0','requiresFreshResearch','selectRoute','uniqueCitations','anthropic/claude-haiku-4.5','openai/gpt-5.4-mini']) {
  if (!router.includes(marker)) throw new Error(`src/router.js missing marker: ${marker}`);
}

const app = await readFile(new URL('../assets/app.js', import.meta.url), 'utf8');
for (const marker of ['/api/v1/status','/api/v1/chat/stream','/api/v1/research','renderCitations','runStreaming','Run with SakthiAI']) {
  if (!app.includes(marker)) throw new Error(`assets/app.js missing marker: ${marker}`);
}

const combined = `${html}\n${worker}\n${router}\n${app}`;
if (/sk-[A-Za-z0-9]{20,}|AIza[A-Za-z0-9_-]{20,}/.test(combined)) throw new Error('Potential API key found in source files');

const manifest = JSON.parse(await readFile(new URL('../manifest.webmanifest', import.meta.url), 'utf8'));
if (manifest.name !== 'Sakthi AI Nexus' || manifest.display !== 'standalone') throw new Error('Invalid PWA manifest');

const wrangler = JSON.parse((await readFile(new URL('../wrangler.jsonc', import.meta.url), 'utf8')).replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, ''));
if (
  wrangler.main !== 'src/worker.js' ||
  wrangler.assets?.directory !== './dist' ||
  wrangler.ai?.binding !== 'AI' ||
  wrangler.vars?.AI_GATEWAY_ID !== 'default' ||
  !wrangler.vars?.ANTHROPIC_MODEL ||
  !wrangler.vars?.OPENAI_MODEL
) {
  throw new Error('Invalid Release 003 Wrangler configuration');
}

console.log('Validation passed: Release 003 UI, router, streaming, fresh research, citations, PWA, Worker API and secret checks.');
