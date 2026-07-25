import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const required = [
  'index.html','offline.html','manifest.webmanifest','service-worker.js','health.json',
  'assets/styles.css','assets/release002.css','assets/release003.css','assets/owner-platform.css','assets/app.js','assets/owner-platform.js','assets/artifact-formats.js','assets/zip.js','assets/task-capture.js','assets/favicon.svg','assets/fallback.css',
  'src/entry.js','src/worker.js','src/router.js','src/free-research.js','src/files.js','src/owner-api.js','wrangler.jsonc','_headers','_redirects',
  'migrations/0001_owner_platform.sql','openapi/sakthiai-v1.yaml',
  'docs/RELEASE_003_IMPLEMENTATION.md','docs/RELEASE_003_1_FREE_RESEARCH.md','docs/RELEASE_004_IMPLEMENTATION.md','docs/RELEASE_005_TO_010_ROADMAP.md'
];

for (const file of required) {
  if (!existsSync(new URL(`../${file}`, import.meta.url))) throw new Error(`Missing required file: ${file}`);
}

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
for (const marker of ['<main','manifest.webmanifest','owner-platform.css','owner-platform.js','Sakthi AI Nexus','Owner build 010','view-projects','view-files','view-artifacts','view-approvals','view-memory','view-usage','view-access','citationPanel','budgetSelect','streamToggle']) {
  if (!html.includes(marker)) throw new Error(`index.html missing marker: ${marker}`);
}

const entry = await readFile(new URL('../src/entry.js', import.meta.url), 'utf8');
for (const marker of ['handleFiles','handleOwnerApi','/api/v1/files','/api/v1/platform','/api/v1/mobile/config','coreWorker.fetch']) {
  if (!entry.includes(marker)) throw new Error(`src/entry.js missing marker: ${marker}`);
}

const worker = await readFile(new URL('../src/worker.js', import.meta.url), 'utf8');
for (const marker of ['/api/v1/status','/api/v1/chat','/api/v1/chat/stream','/api/v1/research','env.AI.run','runFreeResearch','premiumEnabled','FRESH_RESEARCH_UNAVAILABLE']) {
  if (!worker.includes(marker)) throw new Error(`src/worker.js missing marker: ${marker}`);
}

const router = await readFile(new URL('../src/router.js', import.meta.url), 'utf8');
for (const marker of ['0.3.1','requiresFreshResearch','selectRoute','premiumEnabled','PREMIUM_PROVIDERS_ENABLED','free-research','disabled-cost-control']) {
  if (!router.includes(marker)) throw new Error(`src/router.js missing marker: ${marker}`);
}

const freeResearch = await readFile(new URL('../src/free-research.js', import.meta.url), 'utf8');
for (const marker of ['api.gdeltproject.org','wikipedia.org','runFreeResearch','free-first']) {
  if (!freeResearch.includes(marker)) throw new Error(`src/free-research.js missing marker: ${marker}`);
}

const files = await readFile(new URL('../src/files.js', import.meta.url), 'utf8');
for (const marker of ['EVIDENCE_BUCKET','SAKTHI_INGEST_TOKEN','AI_SEARCH','toMarkdown','FILES_NOT_CONFIGURED']) {
  if (!files.includes(marker)) throw new Error(`src/files.js missing marker: ${marker}`);
}

const ownerApi = await readFile(new URL('../src/owner-api.js', import.meta.url), 'utf8');
for (const marker of ['0.10-owner-preview','/api/v1/platform/capabilities','/api/v1/platform/session','/api/v1/mobile/config','browser-indexeddb','paidCallsBlocked']) {
  if (!ownerApi.includes(marker)) throw new Error(`src/owner-api.js missing marker: ${marker}`);
}

const ownerPlatform = await readFile(new URL('../assets/owner-platform.js', import.meta.url), 'utf8');
for (const marker of ['indexedDB.open','projects','approvals','memories','graphNodes','usage','createDocx','createXlsx','createPptx','printPdf','/api/v1/files/capabilities','fileUploadButton']) {
  if (!ownerPlatform.includes(marker)) throw new Error(`assets/owner-platform.js missing marker: ${marker}`);
}

const artifactFormats = await readFile(new URL('../assets/artifact-formats.js', import.meta.url), 'utf8');
for (const marker of ['createDocx','createXlsx','createPptx','createCodeZip','printPdf','createZip']) {
  if (!artifactFormats.includes(marker)) throw new Error(`assets/artifact-formats.js missing marker: ${marker}`);
}

const migration = await readFile(new URL('../migrations/0001_owner_platform.sql', import.meta.url), 'utf8');
for (const marker of ['CREATE TABLE IF NOT EXISTS tenants','projects','conversations','usage_events','approval_requests','memories','knowledge_nodes','knowledge_edges','audit_events']) {
  if (!migration.includes(marker)) throw new Error(`D1 migration missing marker: ${marker}`);
}

const openapi = await readFile(new URL('../openapi/sakthiai-v1.yaml', import.meta.url), 'utf8');
for (const marker of ['openapi: 3.1.0','/api/v1/platform/capabilities','/api/v1/mobile/config','/api/v1/files/upload','TaskRequest']) {
  if (!openapi.includes(marker)) throw new Error(`OpenAPI missing marker: ${marker}`);
}

const app = await readFile(new URL('../assets/app.js', import.meta.url), 'utf8');
for (const marker of ['/api/v1/status','/api/v1/chat/stream','/api/v1/research','renderCitations','runStreaming','Run with SakthiAI']) {
  if (!app.includes(marker)) throw new Error(`assets/app.js missing marker: ${marker}`);
}

const combined = `${html}\n${entry}\n${worker}\n${router}\n${freeResearch}\n${files}\n${ownerApi}\n${ownerPlatform}\n${artifactFormats}\n${app}`;
if (/sk-[A-Za-z0-9]{20,}|AIza[A-Za-z0-9_-]{20,}/.test(combined)) throw new Error('Potential API key found in source files');

const manifest = JSON.parse(await readFile(new URL('../manifest.webmanifest', import.meta.url), 'utf8'));
if (manifest.name !== 'Sakthi AI Nexus' || manifest.display !== 'standalone') throw new Error('Invalid PWA manifest');

const wrangler = JSON.parse((await readFile(new URL('../wrangler.jsonc', import.meta.url), 'utf8')).replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, ''));
if (
  wrangler.main !== 'src/entry.js' ||
  wrangler.assets?.directory !== './dist' ||
  wrangler.ai?.binding !== 'AI' ||
  wrangler.vars?.AI_GATEWAY_ID !== 'default' ||
  wrangler.vars?.PREMIUM_PROVIDERS_ENABLED !== 'false'
) {
  throw new Error('Invalid free-first Worker configuration');
}

console.log('Validation passed: free-first AI, guarded files, and owner-mode Releases 005–010 platform preview.');
