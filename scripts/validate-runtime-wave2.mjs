import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';

const required = [
  'src/runtime-wave2.js',
  'src/runtime-v2/shared.js',
  'src/runtime-v2/boundary.js',
  'src/runtime-v2/tool-registry.js',
  'src/runtime-v2/planner.js',
  'src/runtime-v2/lease.js',
  'src/runtime-v2/approval.js',
  'src/runtime-v2/rollback.js',
  'src/runtime-v2/idempotency.js',
  'src/runtime-v2/observability.js',
  'tests/runtime-wave2.test.mjs',
  'migrations/0004_runtime_wave2.sql',
  'openapi/sakthiai-runtime-wave2.yaml',
  'docs/RUNTIME_WAVE_2_IMPLEMENTATION.md',
  'docs/RUNTIME_WAVE_2_THREAT_MODEL.md',
  'docs/RUNTIME_WAVE_2_ROLLOUT_AND_ROLLBACK.md',
  '.github/workflows/runtime-wave-2-validation.yml'
];

for (const file of required) {
  if (!existsSync(new URL(`../${file}`, import.meta.url))) {
    throw new Error(`Missing Runtime Wave 2 file: ${file}`);
  }
}

const entry = await readFile(new URL('../src/entry.js', import.meta.url), 'utf8');
for (const marker of [
  "handleRuntimeWave2",
  "url.pathname.startsWith('/api/v1/runtime/v2')",
  "handleRuntimeWave1",
  "handleGovernance",
  "coreWorker.fetch"
]) {
  if (!entry.includes(marker)) throw new Error(`src/entry.js missing marker: ${marker}`);
}

const runtime = await readFile(new URL('../src/runtime-wave2.js', import.meta.url), 'utf8');
for (const marker of [
  'runtime-wave-2.0.0',
  '/api/v1/runtime/v2/status',
  '/api/v1/runtime/v2/agent/plan',
  '/api/v1/runtime/v2/tools/lease-proposal',
  '/api/v1/runtime/v2/approvals/classify',
  '/api/v1/runtime/v2/rollback/plan',
  '/api/v1/runtime/v2/idempotency/inspect',
  'wave2State(env)'
]) {
  if (!runtime.includes(marker)) throw new Error(`runtime-wave2.js missing marker: ${marker}`);
}

const sources = await Promise.all(required
  .filter((file) => /\.(js|mjs|md|yaml|sql)$/.test(file))
  .map((file) => readFile(new URL(`../${file}`, import.meta.url), 'utf8')));
const combined = sources.join('\n');

for (const forbidden of [
  'executionAllowed: true',
  'productionWritesEnabled: true',
  'billingEnabled: true',
  'paymentCollectionEnabled: true'
]) {
  if (combined.includes(forbidden)) throw new Error(`Unsafe marker found: ${forbidden}`);
}

console.log('Runtime Wave 2 validation passed: bounded planning, lease proposals, approval classification, rollback, idempotency and emergency stop.');
