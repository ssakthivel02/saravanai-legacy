import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const required = [
  'index.html','offline.html','manifest.webmanifest','service-worker.js',
  'assets/styles.css','assets/app.js','assets/favicon.svg','assets/fallback.css',
  '_headers','_redirects'
];
for (const file of required) {
  if (!existsSync(new URL(`../${file}`, import.meta.url))) throw new Error(`Missing required file: ${file}`);
}
const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
for (const marker of ['<main','manifest.webmanifest','assets/styles.css','assets/app.js','Sakthi AI Nexus']) {
  if (!html.includes(marker)) throw new Error(`index.html missing marker: ${marker}`);
}
if (/sk-[A-Za-z0-9]{20,}|AIza[A-Za-z0-9_-]{20,}/.test(html)) throw new Error('Potential API key found in index.html');
const manifest = JSON.parse(await readFile(new URL('../manifest.webmanifest', import.meta.url), 'utf8'));
if (manifest.name !== 'Sakthi AI Nexus' || manifest.display !== 'standalone') throw new Error('Invalid PWA manifest');
console.log('Validation passed: required files, PWA metadata and basic secret checks.');
