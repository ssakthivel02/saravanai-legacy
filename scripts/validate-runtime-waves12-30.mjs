import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';

const required = [
  'src/entry.js',
  'src/runtime-waves12-30.js',
  'src/runtime-v12-30/catalog.js',
  'src/runtime-v12-30/core.js',
  'tests/runtime-waves12-30.test.mjs',
  'scripts/validate-runtime-waves12-30.mjs',
  '.github/workflows/runtime-waves-12-30-validation.yml',
  'openapi/sakthiai-runtime-waves12-30.yaml',
  'docs/RUNTIME_WAVES_12_30_ENTERPRISE_COMPLETION.md',
  'migrations/0014_runtime_waves12_30.sql',
  'RUNTIME_WAVES_12_30_BASELINE.json',
  'RUNTIME_WAVES_12_30_UPLOAD_README.md'
];

for (const path of required) {
  if (!existsSync(new URL(`../${path}`, import.meta.url))) {
    throw new Error(`Missing required file: ${path}`);
  }
}

const entry = await readFile(new URL('../src/entry.js', import.meta.url), 'utf8');
for (const marker of [
  "from './runtime-waves12-30.js'",
  'runtimeWaves12To30Health',
  'handleRuntimeWaves12To30',
  '/^\\/api\\/v1\\/runtime\\/v(?:1[2-9]|2[0-9]|30)',
  'handleRuntimeWave11',
  'handleRuntimeWave1'
]) {
  if (!entry.includes(marker)) throw new Error(`Entry integration marker missing: ${marker}`);
}

const catalogue = await readFile(new URL('../src/runtime-v12-30/catalog.js', import.meta.url), 'utf8');
for (let wave = 12; wave <= 30; wave += 1) {
  if (!catalogue.includes(`[${wave},`)) throw new Error(`Wave ${wave} missing from catalogue`);
}

const runtime = await readFile(new URL('../src/runtime-waves12-30.js', import.meta.url), 'utf8');
for (const marker of [
  'handleRuntimeWaves12To30',
  'runtimeWaves12To30Health',
  'assess',
  'evidence/validate',
  'risk/classify',
  'plan/validate',
  'gate'
]) {
  if (!runtime.includes(marker)) throw new Error(`Runtime marker missing: ${marker}`);
}

const core = await readFile(new URL('../src/runtime-v12-30/core.js', import.meta.url), 'utf8');
for (const marker of [
  'externalCallsEnabled: false',
  'productionWritesEnabled: false',
  'paidProvidersEnabled: false',
  'publicRegistrationEnabled: false',
  'certificationClaimsEnabled: false'
]) {
  if (!core.includes(marker)) throw new Error(`Safety marker missing: ${marker}`);
}

const safetyFiles = required.filter((path) => !path.startsWith('scripts/'));
const combined = (
  await Promise.all(
    safetyFiles.map((path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8'))
  )
).join('\n');

for (const [name, value] of [
  ['externalCallsEnabled', 'true'],
  ['aiExecutionEnabled', 'true'],
  ['databaseWritesEnabled', 'true'],
  ['productionWritesEnabled', 'true'],
  ['repositoryWritesEnabled', 'true'],
  ['infrastructureChangesEnabled', 'true'],
  ['messagesSent', 'true'],
  ['alertsSent', 'true'],
  ['paymentsEnabled', 'true'],
  ['paidProvidersEnabled', 'true'],
  ['publicRegistrationEnabled', 'true'],
  ['autonomousActionsEnabled', 'true'],
  ['certificationClaimsEnabled', 'true']
]) {
  const marker = `${name}: ${value}`;
  if (combined.includes(marker)) throw new Error(`Unsafe marker found: ${marker}`);
}

console.log('Runtime Waves 12-30 split structural validation passed.');
