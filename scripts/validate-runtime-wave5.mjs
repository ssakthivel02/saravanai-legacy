import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';

const required = [
  'src/runtime-wave5.js', 'src/runtime-v5/core.js', 'src/runtime-v5/slo.js',
  'src/runtime-v5/burn-rate.js', 'src/runtime-v5/incident.js', 'src/runtime-v5/change-risk.js',
  'src/runtime-v5/deployment.js', 'src/runtime-v5/runbook.js', 'src/runtime-v5/health.js',
  'src/runtime-v5/alerting.js', 'src/runtime-v5/telemetry.js', 'src/runtime-v5/evidence.js',
  'tests/runtime-wave5.test.mjs', 'migrations/0007_runtime_wave5.sql',
  'openapi/sakthiai-runtime-wave5.yaml', 'docs/RUNTIME_WAVE_5_IMPLEMENTATION.md',
  'docs/RUNTIME_WAVE_5_THREAT_MODEL.md', 'docs/RUNTIME_WAVE_5_ROLLOUT_AND_ROLLBACK.md',
  '.github/workflows/runtime-wave-5-validation.yml'
];
for (const file of required) if (!existsSync(new URL(`../${file}`, import.meta.url))) throw new Error(`Missing: ${file}`);

const entry = await readFile(new URL('../src/entry.js', import.meta.url), 'utf8');
for (const marker of ['handleRuntimeWave5', "url.pathname.startsWith('/api/v1/runtime/v5')", 'handleRuntimeWave4', 'handleRuntimeWave3', 'handleRuntimeWave2', 'handleRuntimeWave1']) if (!entry.includes(marker)) throw new Error(`Entry missing ${marker}`);
const runtime = await readFile(new URL('../src/runtime-wave5.js', import.meta.url), 'utf8');
for (const marker of ['runtime-wave-5.0.0', '/api/v1/runtime/v5/status', '/api/v1/runtime/v5/slo/evaluate', '/api/v1/runtime/v5/incidents/triage', '/api/v1/runtime/v5/deployments/gate']) if (!runtime.includes(marker)) throw new Error(`Runtime missing ${marker}`);
const texts = await Promise.all(required.filter((f) => ['.js', '.mjs', '.md', '.yaml', '.sql'].some((ext) => f.endsWith(ext))).map((f) => readFile(new URL(`../${f}`, import.meta.url), 'utf8')));
const combined = texts.join('\n');
for (const forbidden of ['alertsSent: true', 'incidentsCreated: true', 'deploymentsExecuted: true', 'rollbacksExecuted: true', 'productionWritesEnabled: true', 'paidMonitoringEnabled: true']) if (combined.includes(forbidden)) throw new Error(`Unsafe marker ${forbidden}`);
console.log('Runtime Wave 5 validation passed: SLO, burn-rate, incident, change, deployment, rollback, runbook, health, alerting, telemetry and evidence controls.');
