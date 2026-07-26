import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';

const required = [
  'src/runtime-wave1.js',
  'src/runtime/shared.js',
  'src/runtime/identity.js',
  'src/runtime/tenant.js',
  'src/runtime/policy.js',
  'src/runtime/ai-envelope.js',
  'src/runtime/output-safety.js',
  'src/runtime/observability.js',
  'tests/runtime-wave1.test.mjs',
  'migrations/0003_runtime_wave1.sql',
  'openapi/sakthiai-runtime-wave1.yaml',
  'docs/RUNTIME_WAVE_1_IMPLEMENTATION.md',
  'docs/RUNTIME_WAVE_1_HLD.md',
  'docs/RUNTIME_WAVE_1_LLD.md',
  'docs/RUNTIME_WAVE_1_THREAT_MODEL.md',
  'docs/RUNTIME_WAVE_1_ROLLOUT_AND_ROLLBACK.md',
  '.github/workflows/runtime-wave-1-validation.yml'
];

for (const file of required) {
  if (!existsSync(new URL(`../${file}`, import.meta.url))) {
    throw new Error(`Missing Runtime Wave 1 file: ${file}`);
  }
}

const entry = await readFile(new URL('../src/entry.js', import.meta.url), 'utf8');
for (const marker of [
  "import { handleRuntimeWave1, RUNTIME_WAVE_1_RELEASE } from './runtime-wave1.js'",
  "url.pathname.startsWith('/api/v1/runtime')",
  'handleFiles',
  'handleOwnerApi',
  'handleGovernance',
  'coreWorker.fetch'
]) {
  if (!entry.includes(marker)) throw new Error(`src/entry.js missing marker: ${marker}`);
}

const runtime = await readFile(new URL('../src/runtime-wave1.js', import.meta.url), 'utf8');
for (const marker of [
  'runtime-wave-1.0.0',
  '/api/v1/runtime/status',
  '/api/v1/runtime/context',
  '/api/v1/runtime/policy/evaluate',
  '/api/v1/runtime/ai/envelope',
  '/api/v1/runtime/ai/output/check',
  '/api/v1/runtime/observability',
  'RUNTIME_WAVE1_ENABLED',
  'productionWritesEnabled: false'
]) {
  if (!runtime.includes(marker)) throw new Error(`runtime-wave1.js missing marker: ${marker}`);
}

const combined = await Promise.all(required
  .filter((file) => /\.(js|mjs|md|yaml|sql)$/.test(file))
  .map((file) => readFile(new URL(`../${file}`, import.meta.url), 'utf8')));
const source = combined.join('\n');

if (/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----\s+[A-Za-z0-9+/=]{80,}/.test(source)) {
  throw new Error('Potential private key material found.');
}
if (/\bsk-[A-Za-z0-9_-]{20,}\b/.test(source.replace(/sk-\[A-Za-z0-9_\-\]/g, ''))) {
  throw new Error('Potential provider key found.');
}

console.log('Runtime Wave 1 validation passed: identity, tenant, policy, AI envelope, output safety and observability.');
