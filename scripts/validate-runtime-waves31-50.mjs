import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';

const required = [
  'src/entry.js',
  'src/runtime-waves31-50.js',
  'src/runtime-v31-50/catalog.js',
  'src/runtime-v31-50/core.js',
  'tests/runtime-waves31-50.test.mjs',
  'scripts/validate-runtime-waves31-50.mjs',
  '.github/workflows/runtime-waves-31-50-validation.yml',
  'openapi/sakthiai-runtime-waves31-50.yaml',
  'docs/RUNTIME_WAVES_31_50_ADVANCED_ASSURANCE.md',
  'migrations/0015_runtime_waves31_50.sql',
  'RUNTIME_WAVES_31_50_BASELINE.json',
  'RUNTIME_WAVES_31_50_UPLOAD_README.md'
];

for (const path of required) {
  if (!existsSync(new URL(`../${path}`, import.meta.url))) {
    throw new Error(`Missing required file: ${path}`);
  }
}

const entry = await readFile(new URL('../src/entry.js', import.meta.url), 'utf8');
for (const marker of [
  "from './runtime-waves31-50.js'",
  'runtimeWaves31To50Health',
  'handleRuntimeWaves31To50',
  '/^\\/api\\/v1\\/runtime\\/v(?:3[1-9]|4[0-9]|50)',
  'runtimeWaves12To30Health',
  'handleRuntimeWave11',
  'handleRuntimeWave1'
]) {
  if (!entry.includes(marker)) throw new Error(`Entry integration marker missing: ${marker}`);
}

const catalogue = await readFile(new URL('../src/runtime-v31-50/catalog.js', import.meta.url), 'utf8');
for (let wave = 31; wave <= 50; wave += 1) {
  if (!catalogue.includes(`"${wave}":`)) throw new Error(`Wave ${wave} missing from catalogue`);
}

const runtime = await readFile(new URL('../src/runtime-waves31-50.js', import.meta.url), 'utf8');
for (const marker of [
  'handleRuntimeWaves31To50',
  'runtimeWaves31To50Health',
  'controls/assess',
  'evidence/validate',
  'scenario/evaluate',
  'exception/validate',
  'decision/gate'
]) {
  if (!runtime.includes(marker)) throw new Error(`Runtime marker missing: ${marker}`);
}

const core = await readFile(new URL('../src/runtime-v31-50/core.js', import.meta.url), 'utf8');
for (const marker of [
  'externalCallsEnabled: false',
  'sourceRetrievalEnabled: false',
  'aiExecutionEnabled: false',
  'codeExecutionEnabled: false',
  'databaseWritesEnabled: false',
  'productionWritesEnabled: false',
  'identityChangesEnabled: false',
  'paymentsEnabled: false',
  'billingEnabled: false',
  'paidProvidersEnabled: false',
  'publicRegistrationEnabled: false',
  'autonomousDecisionsEnabled: false',
  'legalDeterminationsEnabled: false',
  'medicalDeterminationsEnabled: false',
  'financialDeterminationsEnabled: false',
  'certificationClaimsEnabled: false',
  'childProfilingEnabled: false'
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
  ['sourceRetrievalEnabled', 'true'],
  ['aiExecutionEnabled', 'true'],
  ['toolExecutionEnabled', 'true'],
  ['codeExecutionEnabled', 'true'],
  ['databaseWritesEnabled', 'true'],
  ['repositoryWritesEnabled', 'true'],
  ['productionWritesEnabled', 'true'],
  ['infrastructureChangesEnabled', 'true'],
  ['identityChangesEnabled', 'true'],
  ['policyEnforcementEnabled', 'true'],
  ['notificationsEnabled', 'true'],
  ['messagesSent', 'true'],
  ['alertsSent', 'true'],
  ['paymentsEnabled', 'true'],
  ['billingEnabled', 'true'],
  ['paidProvidersEnabled', 'true'],
  ['publicRegistrationEnabled', 'true'],
  ['autonomousDecisionsEnabled', 'true'],
  ['legalDeterminationsEnabled', 'true'],
  ['medicalDeterminationsEnabled', 'true'],
  ['financialDeterminationsEnabled', 'true'],
  ['certificationClaimsEnabled', 'true'],
  ['personalDataPersisted', 'true'],
  ['biometricProcessingEnabled', 'true'],
  ['childProfilingEnabled', 'true']
]) {
  const marker = `${name}: ${value}`;
  if (combined.includes(marker)) throw new Error(`Unsafe marker found: ${marker}`);
}

console.log('Runtime Waves 31-50 structural validation passed.');
