import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';

const required = [
  'src/entry.js','src/runtime-waves7-11.js','src/runtime-v7-11/core.js',
  'src/runtime-v7-11/wave7.js','src/runtime-v7-11/wave8.js','src/runtime-v7-11/wave9.js',
  'src/runtime-v7-11/wave10.js','src/runtime-v7-11/wave11.js','tests/runtime-waves7-11.test.mjs',
  'scripts/validate-runtime-waves7-11.mjs','.github/workflows/runtime-waves-7-11-validation.yml',
  'openapi/sakthiai-runtime-waves7-11.yaml',
  'docs/RUNTIME_WAVES_7_11_IMPLEMENTATION.md','docs/RUNTIME_WAVES_7_11_HLD.md',
  'docs/RUNTIME_WAVES_7_11_THREAT_MODEL.md','docs/RUNTIME_WAVES_7_11_ROLLOUT_AND_ROLLBACK.md',
  'docs/RUNTIME_WAVES_7_11_ACCEPTANCE_CHECKLIST.md',
  'migrations/0009_runtime_wave7.sql','migrations/0010_runtime_wave8.sql',
  'migrations/0011_runtime_wave9.sql','migrations/0012_runtime_wave10.sql',
  'migrations/0013_runtime_wave11.sql'
];

for (const file of required) {
  if (!existsSync(new URL(`../${file}`, import.meta.url))) throw new Error(`Missing ${file}`);
}

const entry = await readFile(new URL('../src/entry.js', import.meta.url),'utf8');
for (const marker of [
  'handleRuntimeWave7','handleRuntimeWave8','handleRuntimeWave9','handleRuntimeWave10','handleRuntimeWave11',
  "url.pathname.startsWith('/api/v1/runtime/v11')","url.pathname.startsWith('/api/v1/runtime/v7')",
  'handleRuntimeWave6','handleRuntimeWave5','handleRuntimeWave4','handleRuntimeWave3','handleRuntimeWave2','handleRuntimeWave1'
]) if (!entry.includes(marker)) throw new Error(`Entry missing ${marker}`);

const runtime = (await Promise.all([
  'src/runtime-waves7-11.js','src/runtime-v7-11/core.js','src/runtime-v7-11/wave7.js',
  'src/runtime-v7-11/wave8.js','src/runtime-v7-11/wave9.js','src/runtime-v7-11/wave10.js','src/runtime-v7-11/wave11.js'
].map((file)=>readFile(new URL(`../${file}`, import.meta.url),'utf8')))).join('\n');
for (let wave=7; wave<=11; wave++) {
  const marker = `runtime-wave-${wave}.0.0`;
  if (!runtime.includes(marker)) throw new Error(`Runtime missing ${marker}`);
}
for (const marker of [
  "`RUNTIME_WAVE${wave}_ENABLED`",
  "`RUNTIME_WAVE${wave}_EMERGENCY_STOP`",
  "`/api/v1/runtime/v${wave}/status`",
  '/api/v1/runtime/v7/model-card/validate',
  '/api/v1/runtime/v8/data/classify',
  '/api/v1/runtime/v9/contracts/validate',
  '/api/v1/runtime/v10/bia/assess',
  '/api/v1/runtime/v11/launch/gate'
]) if (!runtime.includes(marker)) throw new Error(`Runtime marker missing ${marker}`);

const safetyFiles = required.filter((file) => !file.startsWith('scripts/'));
const combined = (await Promise.all(safetyFiles.map((file)=>readFile(new URL(`../${file}`,import.meta.url),'utf8')))).join('\n');
const forbidden = [
  ['productionWritesEnabled', 'true'],
  ['modelExecutionEnabled', 'true'],
  ['personalDataStored', 'true'],
  ['externalCallsEnabled', 'true'],
  ['failoverExecuted', 'true'],
  ['launchExecuted', 'true'],
  ['certificationClaimed', 'true'],
  ['paidEvaluationEnabled', 'true'],
  ['paidPrivacyServicesEnabled', 'true'],
  ['paidIntegrationServicesEnabled', 'true'],
  ['paidResilienceServicesEnabled', 'true'],
  ['paidAssuranceServicesEnabled', 'true']
].map(([left,right]) => `${left}: ${right}`);
for (const marker of forbidden) if (combined.includes(marker)) throw new Error(`Unsafe marker ${marker}`);

console.log('Runtime Waves 7-11 structural validation passed.');
