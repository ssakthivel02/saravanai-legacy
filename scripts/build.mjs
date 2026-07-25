import { cp, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const dist = new URL('../dist/', import.meta.url);
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

const entries = ['index.html','offline.html','manifest.webmanifest','service-worker.js','health.json','_headers','_redirects','assets'];
for (const entry of entries) {
  if (!existsSync(new URL(`../${entry}`, import.meta.url))) {
    throw new Error(`Missing required build input: ${entry}`);
  }
  await cp(new URL(`../${entry}`, import.meta.url), new URL(`../dist/${entry}`, import.meta.url), { recursive: true });
}
console.log('Sakthi AI Nexus static build created in dist/.');
