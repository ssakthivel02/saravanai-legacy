import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const required = [
  'index.html','offline.html','manifest.webmanifest','service-worker.js','health.json',
  'assets/styles.css','assets/release002.css','assets/release003.css','assets/owner-platform.css','assets/owner-security.css','assets/governance-dashboard.css','assets/app.js','assets/owner-platform.js','assets/artifact-formats.js','assets/zip.js','assets/task-capture.js','assets/release-labels.js','assets/owner-security.js','assets/governance-dashboard.js','assets/favicon.svg','assets/fallback.css',
  'src/entry.js','src/worker.js','src/router.js','src/free-research.js','src/files.js','src/owner-api.js','src/governance.js','wrangler.jsonc','_headers','_redirects',
  'migrations/0001_owner_platform.sql','migrations/0002_governance_assurance.sql','openapi/sakthiai-v1.yaml','openapi/sakthiai-governance-v1.yaml',
  'docs/RELEASE_003_IMPLEMENTATION.md','docs/RELEASE_003_1_FREE_RESEARCH.md','docs/RELEASE_004_IMPLEMENTATION.md','docs/RELEASE_005_TO_010_ROADMAP.md','docs/RELEASE_011_OWNER_SECURITY.md','docs/RELEASE_012_TO_020_MASTER_PLAN.md'
];

for (const file of required) {
  if (!existsSync(new URL(`../${file}`, import.meta.url))) throw new Error(`Missing required file: ${file}`);
}

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
for (const marker of ['<main','manifest.webmanifest','owner-platform.css','owner-platform.js','Sakthi AI Nexus','view-projects','view-files','view-artifacts','view-approvals','view-memory','view-usage','view-access','citationPanel','budgetSelect','streamToggle']) {
  if (!html.includes(marker)) throw new Error(`index.html missing marker: ${marker}`);
}

const entry = await readFile(new URL('../src/entry.js', import.meta.url), 'utf8');
for (const marker of ['handleFiles','handleOwnerApi','handleGovernance','GOVERNANCE_RELEASE','/health','/api/v1/governance','/api/v1/files','/api/v1/platform','/api/v1/mobile/config','kimiEnabled','serverTenantWritesEnabled','coreWorker.fetch']) {
  if (!entry.includes(marker)) throw new Error(`src/entry.js missing marker: ${marker}`);
}

const worker = await readFile(new URL('../src/worker.js', import.meta.url), 'utf8');
for (const marker of ['/api/v1/status','/api/v1/chat','/api/v1/chat/stream','/api/v1/research','env.AI.run','runFreeResearch','premiumEnabled','FRESH_RESEARCH_UNAVAILABLE']) {
  if (!worker.includes(marker)) throw new Error(`src/worker.js missing marker: ${marker}`);
}

const router = await readFile(new URL('../src/router.js', import.meta.url), 'utf8');
for (const marker of ['0.11.0-owner-security','requiresFreshResearch','selectRoute','premiumEnabled','PAID_PROVIDER_OWNER_APPROVAL','I_ACKNOWLEDGE_CHARGES','isProviderBlocked','disabled-owner-policy','free-research','disabled-cost-control']) {
  if (!router.includes(marker)) throw new Error(`src/router.js missing marker: ${marker}`);
}

const governance = await readFile(new URL('../src/governance.js', import.meta.url), 'utf8');
for (const marker of ['0.20.0-governance-foundation','Private identity and session boundary','Production certification and launch governance','ISO/IEC 42001','NIST AI Risk Management Framework','OWASP Top 10 for LLM Applications','No public registration','certificationClaims','handleGovernance','cf-access-jwt-assertion']) {
  if (!governance.includes(marker)) throw new Error(`src/governance.js missing marker: ${marker}`);
}

const freeResearch = await readFile(new URL('../src/free-research.js', import.meta.url), 'utf8');
for (const marker of ['api.gdeltproject.org','wikipedia.org','runFreeResearch','free-first']) {
  if (!freeResearch.includes(marker)) throw new Error(`src/free-research.js missing marker: ${marker}`);
}

const files = await readFile(new URL('../src/files.js', import.meta.url), 'utf8');
for (const marker of ['EVIDENCE_BUCKET','SAKTHI_INGEST_TOKEN','AI_SEARCH','toMarkdown','FILES_NOT_CONFIGURED']) {
  if (!files.includes(marker)) throw new Error(`src/files.js missing marker: ${marker}`);
}

const ownerApi = await readFile(new URL('../src/owner-api.js', import.meta.url), 'utf8');
for (const marker of ['0.11.0-owner-security','/api/v1/platform/capabilities','/api/v1/platform/session','/api/v1/mobile/config','browser-indexeddb','paidCallsBlocked','aes256Gcm','plaintextExport']) {
  if (!ownerApi.includes(marker)) throw new Error(`src/owner-api.js missing marker: ${marker}`);
}

const ownerPlatform = await readFile(new URL('../assets/owner-platform.js', import.meta.url), 'utf8');
for (const marker of ['indexedDB.open','projects','approvals','memories','graphNodes','usage','createDocx','createXlsx','createPptx','printPdf','/api/v1/files/capabilities','fileUploadButton']) {
  if (!ownerPlatform.includes(marker)) throw new Error(`assets/owner-platform.js missing marker: ${marker}`);
}

const ownerSecurity = await readFile(new URL('../assets/owner-security.js', import.meta.url), 'utf8');
for (const marker of ['PBKDF2_ITERATIONS','AES-GCM','createOwnerLockVerifier','verifyOwnerPassphrase','encryptOwnerBackup','decryptOwnerBackup','sakthiai-encrypted-backup-v1','DELETE LOCAL DATA','owner-data-locked','Kimi · disabled by owner policy','Premium · disabled by owner policy']) {
  if (!ownerSecurity.includes(marker)) throw new Error(`assets/owner-security.js missing marker: ${marker}`);
}

const taskCapture = await readFile(new URL('../assets/task-capture.js', import.meta.url), 'utf8');
for (const marker of ["import './release-labels.js'","import './owner-security.js'","import './governance-dashboard.js'",'sakthiai:task-complete']) {
  if (!taskCapture.includes(marker)) throw new Error(`assets/task-capture.js missing marker: ${marker}`);
}

const governanceDashboard = await readFile(new URL('../assets/governance-dashboard.js', import.meta.url), 'utf8');
for (const marker of ['/api/v1/governance','governanceProgramme','certificationClaims','serverTenantWritesEnabled','Mandatory production launch gates']) {
  if (!governanceDashboard.includes(marker)) throw new Error(`assets/governance-dashboard.js missing marker: ${marker}`);
}

const artifactFormats = await readFile(new URL('../assets/artifact-formats.js', import.meta.url), 'utf8');
for (const marker of ['createDocx','createXlsx','createPptx','createCodeZip','printPdf','createZip']) {
  if (!artifactFormats.includes(marker)) throw new Error(`assets/artifact-formats.js missing marker: ${marker}`);
}

const ownerMigration = await readFile(new URL('../migrations/0001_owner_platform.sql', import.meta.url), 'utf8');
for (const marker of ['CREATE TABLE IF NOT EXISTS tenants','projects','conversations','usage_events','approval_requests','memories','knowledge_nodes','knowledge_edges','audit_events']) {
  if (!ownerMigration.includes(marker)) throw new Error(`Owner D1 migration missing marker: ${marker}`);
}

const governanceMigration = await readFile(new URL('../migrations/0002_governance_assurance.sql', import.meta.url), 'utf8');
for (const marker of ['control_catalogue','control_framework_mappings','assurance_evidence','governance_risks','data_processing_register','ai_system_register','incidents','release_certifications','tenant_id']) {
  if (!governanceMigration.includes(marker)) throw new Error(`Governance D1 migration missing marker: ${marker}`);
}

const openapi = await readFile(new URL('../openapi/sakthiai-v1.yaml', import.meta.url), 'utf8');
for (const marker of ['openapi: 3.1.0','/api/v1/platform/capabilities','/api/v1/mobile/config','/api/v1/files/upload','TaskRequest']) {
  if (!openapi.includes(marker)) throw new Error(`OpenAPI missing marker: ${marker}`);
}

const governanceOpenapi = await readFile(new URL('../openapi/sakthiai-governance-v1.yaml', import.meta.url), 'utf8');
for (const marker of ['openapi: 3.1.0','/api/v1/governance','/api/v1/governance/frameworks','/api/v1/governance/access','certificationClaims','private-owner-free-first']) {
  if (!governanceOpenapi.includes(marker)) throw new Error(`Governance OpenAPI missing marker: ${marker}`);
}

const app = await readFile(new URL('../assets/app.js', import.meta.url), 'utf8');
for (const marker of ['/api/v1/status','/api/v1/chat/stream','/api/v1/research','renderCitations','runStreaming','Run with SakthiAI']) {
  if (!app.includes(marker)) throw new Error(`assets/app.js missing marker: ${marker}`);
}

const combined = `${html}\n${entry}\n${worker}\n${router}\n${governance}\n${freeResearch}\n${files}\n${ownerApi}\n${ownerPlatform}\n${ownerSecurity}\n${governanceDashboard}\n${artifactFormats}\n${app}`;
if (/sk-[A-Za-z0-9]{20,}|AIza[A-Za-z0-9_-]{20,}/.test(combined)) throw new Error('Potential API key found in source files');

const manifest = JSON.parse(await readFile(new URL('../manifest.webmanifest', import.meta.url), 'utf8'));
if (manifest.name !== 'SaravanAI — Private AI Workspace' || manifest.short_name !== 'SaravanAI' || manifest.display !== 'standalone') throw new Error('Invalid SaravanAI PWA manifest');

const wrangler = JSON.parse((await readFile(new URL('../wrangler.jsonc', import.meta.url), 'utf8')).replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, ''));
if (
  wrangler.main !== 'src/entry.js' ||
  wrangler.assets?.directory !== './dist' ||
  wrangler.ai?.binding !== 'AI' ||
  wrangler.vars?.AI_GATEWAY_ID !== 'default' ||
  wrangler.vars?.PREMIUM_PROVIDERS_ENABLED !== 'false' ||
  wrangler.vars?.PAID_PROVIDER_OWNER_APPROVAL !== 'NOT_APPROVED' ||
  'KIMI_MODEL' in wrangler.vars ||
  !wrangler.assets?.run_worker_first?.includes('/health')
) {
  throw new Error('Invalid free-first security configuration');
}

const health = JSON.parse(await readFile(new URL('../health.json', import.meta.url), 'utf8'));
if (health.version !== '0.11.0-owner-security' || health.kimiEnabled !== false || health.premiumProvidersEnabled !== false || health.encryptedBackups !== true) {
  throw new Error('Invalid Release 011 health metadata');
}

console.log('Validation passed: SaravanAI legacy PWA identity with SakthiAI Release 012-020 governance foundation, Release 011 owner security and free-only routing.');
