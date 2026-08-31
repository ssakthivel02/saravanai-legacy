import fs from 'node:fs';

const required = [
  'src/tenant-context.js',
  'src/tenant-storage-policy.js',
  'src/tenant-record-contract.js',
  'src/tenant-repository.js',
  'src/tenant-quota-policy.js',
  'src/tenant-retention-policy.js',
  'src/platform-release-018.js',
  'assets/tenant-persistence.js',
  'assets/tenant-persistence.css',
  'migrations/0009_tenant_persistence_foundation.sql',
  'docs/BUILD_018_TENANT_PERSISTENCE.md',
  'docs/BUILD_018_ARCHITECTURE.md',
  'docs/BUILD_018_THREAT_MODEL.md',
  'TENANT_PERSISTENCE_BASELINE.json'
];

for (const path of required) {
  if (!fs.existsSync(path)) throw new Error(`Missing Build 018 file: ${path}`);
}

const context = fs.readFileSync('src/tenant-context.js', 'utf8');
const storage = fs.readFileSync('src/tenant-storage-policy.js', 'utf8');
const repository = fs.readFileSync('src/tenant-repository.js', 'utf8');
const platform = fs.readFileSync('src/platform-release-018.js', 'utf8');
const migration = fs.readFileSync('migrations/0009_tenant_persistence_foundation.sql', 'utf8');
const entry = fs.readFileSync('src/entry.js', 'utf8');
const labels = fs.readFileSync('assets/release-labels.js', 'utf8');
const worker = fs.readFileSync('service-worker.js', 'utf8');
const openapi = fs.readFileSync('openapi/sakthiai-v1.yaml', 'utf8');
const wrangler = fs.readFileSync('wrangler.jsonc', 'utf8');
const baseline = JSON.parse(fs.readFileSync('TENANT_PERSISTENCE_BASELINE.json', 'utf8'));

for (const marker of ['verified-tenant-context-1.0.0', 'x-sakthiai-access-verified', 'tenantIdExposed: false', 'emailIncluded: false']) {
  if (!context.includes(marker)) throw new Error(`Tenant context missing marker: ${marker}`);
}
for (const marker of ['TENANT_PERSISTENCE_ENABLED', 'TENANT_PERSISTENCE_EMERGENCY_STOP', 'TENANT_SERVER_WRITES_ENABLED', 'migrationAutomaticallyExecuted: false']) {
  if (!storage.includes(marker)) throw new Error(`Storage policy missing marker: ${marker}`);
}
for (const marker of ['writeImplemented: false', 'deleteImplemented: false', 'TENANT_WRITE_PREVIEW_ONLY']) {
  if (!repository.includes(marker)) throw new Error(`Repository missing safety marker: ${marker}`);
}
for (const marker of ['0.18.0-tenant-persistence-foundation', '/api/v1/platform/storage/readiness', 'migrationExecuted: false', 'writesExecuted: false']) {
  if (!platform.includes(marker)) throw new Error(`Build 018 platform marker missing: ${marker}`);
}
for (const marker of ['payload_ciphertext BLOB NOT NULL', 'No email address, JWT, Access AUD, password, provider key or raw profile key is stored']) {
  if (!migration.includes(marker)) throw new Error(`Migration safety marker missing: ${marker}`);
}
if (!entry.includes("from './platform-release-018.js'")) throw new Error('Build 018 platform overlay is not wired into entry.js.');
if (!labels.includes("import './tenant-persistence.js'")) throw new Error('Tenant persistence UI is not loaded.');
if (!/Owner build (?:0?1[89]|[2-9]\d)/i.test(labels)) throw new Error('Current owner build label must remain at Build 018 or later.');
if (!/(?:sakthiai|saravanai)-owner-v(?:1[89]|[2-9]\d)-/.test(worker)) throw new Error('Current PWA cache must remain at Build 018 or later under the compatible SakthiAI/SaravanAI cache identity.');
if (!openapi.includes('/api/v1/platform/storage/readiness:') || !/version: 0\.(?:1[89]|[2-9]\d)\./.test(openapi)) {
  throw new Error('Primary OpenAPI must retain Build 018 storage readiness and use release 0.18.0 or later.');
}

for (const variable of [
  'TENANT_PERSISTENCE_ENABLED',
  'TENANT_SERVER_WRITES_ENABLED',
  'TENANT_HARD_QUOTA_ENABLED',
  'PUBLIC_REGISTRATION',
  'PREMIUM_PROVIDERS_ENABLED'
]) {
  if (new RegExp(`"${variable}"\\s*:\\s*"true"`).test(wrangler)) throw new Error(`Repository defaults must not enable ${variable}.`);
}

if (baseline.schema.automaticallyExecuted !== false) throw new Error('Migration must remain manual.');
if (baseline.schema.plaintextPayloadAllowed !== false) throw new Error('Plaintext payload storage must remain prohibited.');
if (baseline.activation.persistenceEnabledByDefault !== false) throw new Error('Persistence must remain disabled by default.');
if (baseline.activation.serverWritesEnabledByDefault !== false) throw new Error('Server writes must remain disabled by default.');
if (baseline.cost.paidOverageAllowed !== false || baseline.cost.silentPaidFallback !== false) throw new Error('Paid overage must remain disabled.');

console.log('Build 018 tenant persistence, isolation, quota and migration safety validation passed for the current owner build.');
