import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';

const required = [
  'src/runtime-wave3.js',
  'src/runtime-v3/shared.js',
  'src/runtime-v3/boundary.js',
  'src/runtime-v3/source-policy.js',
  'src/runtime-v3/quarantine.js',
  'src/runtime-v3/retrieval.js',
  'src/runtime-v3/citations.js',
  'src/runtime-v3/contradictions.js',
  'src/runtime-v3/temporal.js',
  'src/runtime-v3/evidence.js',
  'src/runtime-v3/corrections.js',
  'src/runtime-v3/observability.js',
  'tests/runtime-wave3.test.mjs',
  'migrations/0005_runtime_wave3.sql',
  'openapi/sakthiai-runtime-wave3.yaml',
  'docs/RUNTIME_WAVE_3_IMPLEMENTATION.md',
  'docs/RUNTIME_WAVE_3_THREAT_MODEL.md',
  'docs/RUNTIME_WAVE_3_ROLLOUT_AND_ROLLBACK.md',
  '.github/workflows/runtime-wave-3-validation.yml'
];

for (const file of required) {
  if (!existsSync(new URL(`../${file}`, import.meta.url))) {
    throw new Error(`Missing Runtime Wave 3 file: ${file}`);
  }
}

const entry = await readFile(new URL('../src/entry.js', import.meta.url), 'utf8');
for (const marker of [
  'handleRuntimeWave3',
  "url.pathname.startsWith('/api/v1/runtime/v3')",
  'handleRuntimeWave2',
  'handleRuntimeWave1',
  'coreWorker.fetch'
]) {
  if (!entry.includes(marker)) throw new Error(`src/entry.js missing marker: ${marker}`);
}

const runtime = await readFile(new URL('../src/runtime-wave3.js', import.meta.url), 'utf8');
for (const marker of [
  'runtime-wave-3.0.0',
  '/api/v1/runtime/v3/status',
  '/api/v1/runtime/v3/sources/validate',
  '/api/v1/runtime/v3/ingestion/quarantine-preview',
  '/api/v1/runtime/v3/retrieval/plan',
  '/api/v1/runtime/v3/citations/validate',
  '/api/v1/runtime/v3/contradictions/analyse',
  '/api/v1/runtime/v3/temporal/verify',
  '/api/v1/runtime/v3/evidence/package',
  '/api/v1/runtime/v3/corrections/plan'
]) {
  if (!runtime.includes(marker)) throw new Error(`runtime-wave3.js missing marker: ${marker}`);
}

const sources = await Promise.all(required
  .filter((file) => /\.(js|mjs|md|yaml|sql)$/.test(file))
  .map((file) => readFile(new URL(`../${file}`, import.meta.url), 'utf8')));
const combined = sources.join('\n');

for (const forbidden of [
  'externalFetch: true',
  'databaseWrites: true',
  'aiExecution: true',
  'contentStored: true',
  'executionAllowed: true',
  'productionWritesEnabled: true'
]) {
  if (combined.includes(forbidden)) throw new Error(`Unsafe marker found: ${forbidden}`);
}

console.log('Runtime Wave 3 validation passed: source policy, quarantine, retrieval planning, citations, contradiction, temporal, evidence and correction controls.');
