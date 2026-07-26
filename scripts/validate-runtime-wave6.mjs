import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';

const required = [
  'src/runtime-wave6.js', 'src/runtime-v6/core.js', 'src/runtime-v6/sbom.js',
  'src/runtime-v6/dependency.js', 'src/runtime-v6/provenance.js', 'src/runtime-v6/secrets.js',
  'src/runtime-v6/iac.js', 'src/runtime-v6/licenses.js', 'src/runtime-v6/workflow.js',
  'src/runtime-v6/artifact.js', 'src/runtime-v6/attestation.js', 'src/runtime-v6/repository.js',
  'src/runtime-v6/exception.js', 'src/runtime-v6/release-gate.js', 'src/runtime-v6/evidence.js',
  'tests/runtime-wave6.test.mjs', 'migrations/0008_runtime_wave6.sql',
  'openapi/sakthiai-runtime-wave6.yaml', 'docs/RUNTIME_WAVE_6_IMPLEMENTATION.md',
  'docs/RUNTIME_WAVE_6_THREAT_MODEL.md', 'docs/RUNTIME_WAVE_6_ROLLOUT_AND_ROLLBACK.md',
  '.github/workflows/runtime-wave-6-validation.yml'
];

for (const file of required) {
  if (!existsSync(new URL(`../${file}`, import.meta.url))) throw new Error(`Missing: ${file}`);
}

const entry = await readFile(new URL('../src/entry.js', import.meta.url), 'utf8');
for (const marker of [
  'handleRuntimeWave6', "url.pathname.startsWith('/api/v1/runtime/v6')",
  'handleRuntimeWave5', 'handleRuntimeWave4', 'handleRuntimeWave3', 'handleRuntimeWave2', 'handleRuntimeWave1'
]) {
  if (!entry.includes(marker)) throw new Error(`Entry missing ${marker}`);
}

const runtime = await readFile(new URL('../src/runtime-wave6.js', import.meta.url), 'utf8');
for (const marker of [
  'runtime-wave-6.0.0', '/api/v1/runtime/v6/status', '/api/v1/runtime/v6/sbom/validate',
  '/api/v1/runtime/v6/dependencies/assess', '/api/v1/runtime/v6/provenance/validate',
  '/api/v1/runtime/v6/releases/gate'
]) {
  if (!runtime.includes(marker)) throw new Error(`Runtime missing ${marker}`);
}

const texts = await Promise.all(required
  .filter((file) => ['.js', '.mjs', '.md', '.yaml', '.sql'].some((ext) => file.endsWith(ext)))
  .map((file) => readFile(new URL(`../${file}`, import.meta.url), 'utf8')));

const combined = texts.join('\n');
for (const forbidden of [
  'externalScannersEnabled: true', 'repositoryWritesEnabled: true',
  'artifactSigningEnabled: true', 'workflowChangesEnabled: true',
  'packageInstallationEnabled: true', 'productionWritesEnabled: true',
  'paidSecurityServicesEnabled: true', 'autoMergeExecuted: true',
  'deploymentExecuted: true'
]) {
  if (combined.includes(forbidden)) throw new Error(`Unsafe marker ${forbidden}`);
}

console.log('Runtime Wave 6 validation passed: SBOM, dependency, provenance, secret, IaC, licence, workflow, artifact, attestation, repository, exception, release-gate and evidence controls.');
