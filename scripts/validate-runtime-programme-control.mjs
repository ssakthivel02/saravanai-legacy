import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';

const required = [
  'src/entry.js',
  'src/runtime-programme-control.js',
  'tests/runtime-programme-control.test.mjs',
  'scripts/validate-runtime-programme-control.mjs',
  'scripts/runtime-programme-smoke.mjs',
  '.github/workflows/runtime-programme-control-validation.yml',
  'docs/RUNTIME_PROGRAMME_1_50_CONTROL_CENTRE.md',
  'docs/RUNTIME_PROGRAMME_1_50_ROLLOUT_AND_ROLLBACK.md',
  'evidence/runtime-programme-1-50-index.json',
  'openapi/sakthiai-runtime-programme-control.yaml',
  'RUNTIME_PROGRAMME_1_50_BASELINE.json'
];

for (const path of required) {
  if (!existsSync(new URL(`../${path}`, import.meta.url))) throw new Error(`Missing required file: ${path}`);
}

const entry = await readFile(new URL('../src/entry.js', import.meta.url), 'utf8');
for (const marker of [
  "from './runtime-programme-control.js'",
  'runtimeProgrammeHealth',
  'handleRuntimeProgrammeControl',
  "url.pathname === '/runtime/control-centre'",
  "url.pathname.startsWith('/api/v1/runtime/programme')"
]) {
  if (!entry.includes(marker)) throw new Error(`Entry integration marker missing: ${marker}`);
}

const runtime = await readFile(new URL('../src/runtime-programme-control.js', import.meta.url), 'utf8');
for (const marker of [
  "runtime-programme-control-1.0.0",
  'RUNTIME_PROGRAMME_WAVE_COUNT = 50',
  '/api/v1/runtime/programme/status',
  '/api/v1/runtime/programme/control-centre',
  '/api/v1/runtime/programme/evidence/validate',
  '/api/v1/runtime/programme/smoke/plan',
  '/api/v1/runtime/programme/release/gate',
  '/api/v1/runtime/programme/rollback/plan',
  'productionWritesEnabled: false',
  'billingEnabled: false',
  'paidProvidersEnabled: false',
  'autonomousActionsEnabled: false',
  'externalCallsEnabled: false'
]) {
  if (!runtime.includes(marker)) throw new Error(`Runtime control marker missing: ${marker}`);
}

const combined = [
  entry,
  runtime,
  await readFile(new URL('../RUNTIME_PROGRAMME_1_50_BASELINE.json', import.meta.url), 'utf8')
].join('\n');
for (const marker of [
  'productionWritesEnabled: true',
  'billingEnabled: true',
  'paidProvidersEnabled: true',
  'publicRegistrationEnabled: true',
  'autonomousActionsEnabled: true',
  'externalCallsEnabled: true',
  'executed: true',
  'merged: true',
  'deployed: true'
]) {
  if (combined.includes(marker)) throw new Error(`Unsafe marker found: ${marker}`);
}

console.log('Runtime Programme 1-50 structural validation passed.');
