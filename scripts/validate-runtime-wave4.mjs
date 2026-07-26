import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
const required = [
  'src/runtime-wave4.js', 'src/runtime-v4/core.js', 'src/runtime-v4/workspace.js',
  'src/runtime-v4/membership.js', 'src/runtime-v4/roles.js', 'src/runtime-v4/sharing.js',
  'src/runtime-v4/governance.js', 'src/runtime-v4/audit.js', 'src/runtime-v4/trust.js',
  'tests/runtime-wave4.test.mjs', 'migrations/0006_runtime_wave4.sql',
  'openapi/sakthiai-runtime-wave4.yaml', 'docs/RUNTIME_WAVE_4_IMPLEMENTATION.md',
  'docs/RUNTIME_WAVE_4_THREAT_MODEL.md', 'docs/RUNTIME_WAVE_4_ROLLOUT_AND_ROLLBACK.md',
  '.github/workflows/runtime-wave-4-validation.yml'
];
for (const file of required) if (!existsSync(new URL(`../${file}`, import.meta.url))) throw new Error(`Missing: ${file}`);
const entry = await readFile(new URL('../src/entry.js', import.meta.url), 'utf8');
for (const marker of ['handleRuntimeWave4', "url.pathname.startsWith('/api/v1/runtime/v4')", 'handleRuntimeWave3', 'handleRuntimeWave2', 'handleRuntimeWave1']) if (!entry.includes(marker)) throw new Error(`Entry missing ${marker}`);
const runtime = await readFile(new URL('../src/runtime-wave4.js', import.meta.url), 'utf8');
for (const marker of ['runtime-wave-4.0.0', '/api/v1/runtime/v4/status', '/api/v1/runtime/v4/workspaces/validate', '/api/v1/runtime/v4/trust-centre']) if (!runtime.includes(marker)) throw new Error(`Runtime missing ${marker}`);
const texts = await Promise.all(required.filter((f) => f.endsWith('.js') || f.endsWith('.mjs') || f.endsWith('.md') || f.endsWith('.yaml') || f.endsWith('.sql')).map((f) => readFile(new URL(`../${f}`, import.meta.url), 'utf8')));
const combined = texts.join('\n');
for (const forbidden of ['workspaceWritesEnabled: true', 'invitationSendingEnabled: true', 'exportGenerationEnabled: true', 'paidFeaturesEnabled: true']) if (combined.includes(forbidden)) throw new Error(`Unsafe marker ${forbidden}`);
console.log('Runtime Wave 4 validation passed: workspace, membership, roles, sharing, governance, audit, accessibility and trust controls.');
