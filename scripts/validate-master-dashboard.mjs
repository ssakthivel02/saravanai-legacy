import { readFile } from 'node:fs/promises';

const dashboard = JSON.parse(await readFile(new URL('../assets/data/master-dashboard.v1.json', import.meta.url), 'utf8'));
const ui = await readFile(new URL('../assets/governance-dashboard.js', import.meta.url), 'utf8');
const docs = await readFile(new URL('../docs/MASTER_DASHBOARD_AND_INNOVATION_RADAR.md', import.meta.url), 'utf8');
const capabilityRegistry = JSON.parse(await readFile(new URL('../config/capability-registry.v1.json', import.meta.url), 'utf8'));
const taskState = JSON.parse(await readFile(new URL('../schemas/task-state-v1.schema.json', import.meta.url), 'utf8'));

if (dashboard.schemaVersion !== '1.0.0' || dashboard.publicSafe !== true) throw new Error('Invalid master dashboard schema/safety state');
if (dashboard.capturePolicy?.rawChatStoredInRepository !== false || dashboard.capturePolicy?.secretsAllowed !== false || dashboard.capturePolicy?.personalSensitiveDataAllowed !== false) {
  throw new Error('Master dashboard capture policy must prohibit raw chat, secrets and sensitive personal data');
}
for (const lane of ['ownerPilot', 'publicCandidate', 'watch', 'reject']) {
  if (!dashboard.releaseLanes?.[lane]) throw new Error(`Master dashboard missing release lane: ${lane}`);
}
if (!Array.isArray(dashboard.priorityBuilds) || dashboard.priorityBuilds[0]?.id !== 'P0-TASKSTATE') throw new Error('TaskState must remain the first parity-foundation priority');
if (!Array.isArray(dashboard.innovationRadar) || dashboard.innovationRadar.length < 10) throw new Error('Innovation radar is incomplete');
for (const item of dashboard.innovationRadar) {
  for (const field of ['vendor', 'technology', 'whatSakthiAILearns', 'action', 'lane', 'risk', 'source', 'sourceChecked']) {
    if (!item[field]) throw new Error(`Innovation radar item ${item.id || 'unknown'} missing ${field}`);
  }
}
for (const marker of ['sakthiMasterDashboard', 'master-dashboard.v1.json', 'Global AI innovation radar', 'Owner-pilot → public graduation gates', 'Distilled only']) {
  if (!ui.includes(marker)) throw new Error(`Master dashboard UI missing marker: ${marker}`);
}
for (const marker of ['durable design-memory surface', 'Owner Pilot', 'Public Candidate', 'architecture before feature count', 'MCP/A2A/A2UI']) {
  if (!docs.includes(marker)) throw new Error(`Master dashboard documentation missing marker: ${marker}`);
}
if (capabilityRegistry.policy?.providerNeutral !== true || capabilityRegistry.policy?.comparativeModelClaimsRequireBenchmarks !== true) throw new Error('Capability registry lost provider-neutral/benchmark guardrails');
if (taskState.title !== 'SakthiAI TaskStateV1') throw new Error('Portable TaskStateV1 schema missing');

console.log(`Master dashboard validation passed: ${dashboard.innovationRadar.length} innovation signals, ${dashboard.priorityBuilds.length} ordered priorities.`);
