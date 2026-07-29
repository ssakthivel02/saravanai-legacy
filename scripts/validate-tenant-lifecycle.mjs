import fs from 'node:fs';

const required = [
  'src/tenant-rehearsal-plan.js',
  'src/tenant-backup-contract.js',
  'src/tenant-restore-contract.js',
  'src/tenant-isolation-assurance.js',
  'src/tenant-deletion-assurance.js',
  'src/tenant-recovery-policy.js',
  'src/platform-release-019.js',
  'assets/tenant-lifecycle.js',
  'assets/tenant-lifecycle.css',
  'tests/tenant-rehearsal-plan.test.mjs',
  'tests/tenant-backup-contract.test.mjs',
  'tests/tenant-restore-contract.test.mjs',
  'tests/tenant-isolation-assurance.test.mjs',
  'tests/tenant-deletion-assurance.test.mjs',
  'tests/tenant-recovery-policy.test.mjs',
  'tests/tenant-lifecycle-ui.test.mjs',
  'tests/platform-release-019.test.mjs',
  'docs/BUILD_019_TENANT_LIFECYCLE.md',
  'docs/BUILD_019_ARCHITECTURE.md',
  'docs/BUILD_019_THREAT_MODEL.md',
  'docs/BUILD_019_RUNBOOK.md',
  'migrations/0010_tenant_lifecycle_evidence.sql',
  'openapi/sakthiai-tenant-lifecycle-v1.yaml',
  'TENANT_LIFECYCLE_BASELINE.json'
];

for (const path of required) {
  if (!fs.existsSync(path)) throw new Error(`Missing Build 019 file: ${path}`);
}

const rehearsal = fs.readFileSync('src/tenant-rehearsal-plan.js', 'utf8');
const backup = fs.readFileSync('src/tenant-backup-contract.js', 'utf8');
const restore = fs.readFileSync('src/tenant-restore-contract.js', 'utf8');
const isolation = fs.readFileSync('src/tenant-isolation-assurance.js', 'utf8');
const deletion = fs.readFileSync('src/tenant-deletion-assurance.js', 'utf8');
const recovery = fs.readFileSync('src/tenant-recovery-policy.js', 'utf8');
const platform = fs.readFileSync('src/platform-release-019.js', 'utf8');
const entry = fs.readFileSync('src/entry.js', 'utf8');
const catalogue = fs.readFileSync('src/access-route-catalogue.js', 'utf8');
const labels = fs.readFileSync('assets/release-labels.js', 'utf8');
const worker = fs.readFileSync('service-worker.js', 'utf8');
const migration = fs.readFileSync('migrations/0010_tenant_lifecycle_evidence.sql', 'utf8');
const primaryOpenapi = fs.readFileSync('openapi/sakthiai-v1.yaml', 'utf8');
const dedicatedOpenapi = fs.readFileSync('openapi/sakthiai-tenant-lifecycle-v1.yaml', 'utf8');
const wrangler = fs.readFileSync('wrangler.jsonc', 'utf8');
const baseline = JSON.parse(fs.readFileSync('TENANT_LIFECYCLE_BASELINE.json', 'utf8'));

for (const marker of ['baseline-export','rollback-rehearsal','productionExecutionAllowed: false','migrationExecuted: false']) if (!rehearsal.includes(marker)) throw new Error(`Rehearsal marker missing: ${marker}`);
for (const marker of ['BACKUP_NON_PRODUCTION_ENVIRONMENT_REQUIRED','backupCreatedByRuntime: false','automaticUploadEnabled: false']) if (!backup.includes(marker)) throw new Error(`Backup marker missing: ${marker}`);
for (const marker of ['RESTORE_DIGEST_MISMATCH','productionRestoreAllowed: false','restoreExecutedByRuntime: false']) if (!restore.includes(marker)) throw new Error(`Restore marker missing: ${marker}`);
for (const marker of ['cross-tenant-read-denied','browser-tenant-override-ignored','crossTenantAccessAllowed: false']) if (!isolation.includes(marker)) throw new Error(`Isolation marker missing: ${marker}`);
for (const marker of ['DELETE_BLOCKED_BY_LEGAL_HOLD','hardDeleteExecuted: false','productionDeletionAllowed: false']) if (!deletion.includes(marker)) throw new Error(`Deletion marker missing: ${marker}`);
for (const marker of ['TENANT_LIFECYCLE_ASSURANCE_ENABLED','TENANT_LIFECYCLE_EMERGENCY_STOP','automaticRecoveryEnabled: false','paidRecoveryServiceRequired: false']) if (!recovery.includes(marker)) throw new Error(`Recovery marker missing: ${marker}`);
for (const marker of ['0.19.0-tenant-lifecycle-assurance','/api/v1/platform/storage/lifecycle','migrationExecuted: false','restoreExecuted: false','deletionExecuted: false']) if (!platform.includes(marker)) throw new Error(`Platform marker missing: ${marker}`);
if (!entry.includes("from './platform-release-019.js'")) throw new Error('Build 019 platform overlay is not wired into entry.js.');
if (!catalogue.includes('owner-storage-lifecycle')) throw new Error('Build 019 owner route is not classified.');
if (!labels.includes("import './tenant-lifecycle.js'")) throw new Error('Build 019 lifecycle UI is not loaded.');
for (const asset of ['/assets/tenant-lifecycle.js','/assets/tenant-lifecycle.css']) if (!worker.includes(asset)) throw new Error(`Service worker does not cache ${asset}`);
if (!worker.includes('sakthiai-owner-v19-tenant-lifecycle')) throw new Error('Build 019 PWA cache rotation is missing.');
if (!primaryOpenapi.includes('/api/v1/platform/storage/lifecycle:') || !primaryOpenapi.includes('0.19.0-tenant-lifecycle-assurance')) throw new Error('Primary OpenAPI Build 019 contract is missing.');
if (!dedicatedOpenapi.includes('productionActionsAllowed') || !dedicatedOpenapi.includes('paidFallbackEnabled')) throw new Error('Dedicated lifecycle OpenAPI safety contract is incomplete.');
for (const marker of ['DO NOT execute automatically','environment IN (\'local\',\'preview\',\'non-production\')','No email, JWT, Access AUD']) if (!migration.includes(marker)) throw new Error(`Migration safety marker missing: ${marker}`);

for (const variable of [
  'TENANT_LIFECYCLE_ASSURANCE_ENABLED',
  'TENANT_REHEARSAL_APPROVED',
  'TENANT_BACKUP_EVIDENCE_APPROVED',
  'TENANT_RESTORE_EVIDENCE_APPROVED',
  'TENANT_ISOLATION_EVIDENCE_APPROVED',
  'TENANT_DELETION_EVIDENCE_APPROVED',
  'TENANT_PERSISTENCE_ENABLED',
  'TENANT_SERVER_WRITES_ENABLED',
  'PUBLIC_REGISTRATION',
  'PREMIUM_PROVIDERS_ENABLED'
]) {
  if (new RegExp(`"${variable}"\\s*:\\s*"true"`).test(wrangler)) throw new Error(`Repository defaults must not enable ${variable}.`);
}

if (baseline.scope.backupExecution !== false || baseline.scope.restoreExecution !== false || baseline.scope.deletionExecution !== false) throw new Error('Lifecycle operations must remain non-executing.');
if (baseline.activation.lifecycleAssuranceEnabledByDefault !== false || baseline.activation.emergencyStoppedByDefault !== true) throw new Error('Lifecycle assurance must remain disabled and stopped by default.');
if (baseline.privacy.evidencePayloadPersisted !== false) throw new Error('Evidence payload persistence must remain disabled.');
if (baseline.cost.paidServicesRequired !== false || baseline.cost.silentPaidFallback !== false) throw new Error('Build 019 must remain free-first.');

console.log('Build 019 tenant lifecycle, backup, restore, isolation, deletion and recovery safety validation passed.');
