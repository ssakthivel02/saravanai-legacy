import fs from 'node:fs';

const required = [
  'assets/access-readiness.js',
  'assets/access-readiness.css',
  'assets/release-labels.js',
  'service-worker.js',
  'src/owner-api.js',
  'openapi/sakthiai-v1.yaml',
  'tests/access-readiness.test.mjs',
  'tests/platform-release-contract.test.mjs',
  'docs/BUILD_015_ACCESS_READINESS.md'
];

for (const path of required) {
  if (!fs.existsSync(path)) throw new Error(`Missing Build 015 foundation file: ${path}`);
}

const ownerApi = fs.readFileSync('src/owner-api.js', 'utf8');
const readiness = fs.readFileSync('assets/access-readiness.js', 'utf8');
const labels = fs.readFileSync('assets/release-labels.js', 'utf8');
const serviceWorker = fs.readFileSync('service-worker.js', 'utf8');
const openapi = fs.readFileSync('openapi/sakthiai-v1.yaml', 'utf8');
const wrangler = fs.readFileSync('wrangler.jsonc', 'utf8');
const docs = fs.readFileSync('docs/BUILD_015_ACCESS_READINESS.md', 'utf8');

for (const marker of [
  '/api/v1/platform/release',
  'memberInvitationsEnabled: false',
  'serverHardQuotaEnabled: false',
  'paidFallbackEnabled: false',
  'publicRegistration: false',
  'serverWritesAllowed: false'
]) {
  if (!ownerApi.includes(marker)) throw new Error(`Owner release contract missing marker: ${marker}`);
}
if (!/const PLATFORM_RELEASE = '0\.(?:1[5-9]|[2-9]\d)\./.test(ownerApi)) {
  throw new Error('Owner platform release must remain at Build 015 or later.');
}
if (!/const OWNER_BUILD = (?:1[5-9]|[2-9]\d);/.test(ownerApi)) {
  throw new Error('Owner build number must remain at 15 or later.');
}

for (const marker of [
  'deriveAccessReadiness',
  'platformReleaseLabel',
  '/api/v1/platform/release',
  '/api/v1/platform/session',
  'Blocked until server RBAC',
  'Paid fallback'
]) {
  if (!readiness.includes(marker)) throw new Error(`Access readiness module missing marker: ${marker}`);
}

if (!labels.includes("import './access-readiness.js'")) throw new Error('Access readiness module is not loaded by the current UI chain.');
if (!/Owner build 0?(?:1[5-9]|[2-9]\d)/i.test(labels)) throw new Error('Current owner build label must be 015 or later.');
for (const asset of ['/assets/access-readiness.js', '/assets/access-readiness.css']) {
  if (!serviceWorker.includes(asset)) throw new Error(`Service worker does not cache ${asset}`);
}
if (!/(?:sakthiai|saravanai)-owner-v(?:1[5-9]|[2-9]\d)-/.test(serviceWorker)) throw new Error('Current access-readiness-era cache rotation is missing under the compatible SakthiAI/SaravanAI cache identity.');
if (!openapi.includes('/api/v1/platform/release:')) {
  throw new Error('OpenAPI release-readiness contract is missing.');
}
if (/"ACCESS_JWT_ENFORCEMENT_ENABLED"\s*:\s*"true"/.test(wrangler)) throw new Error('Repository defaults must not activate Access JWT enforcement.');
if (/"PUBLIC_REGISTRATION"\s*:\s*"true"/.test(wrangler)) throw new Error('Repository defaults must not enable public registration.');
if (/"PREMIUM_PROVIDERS_ENABLED"\s*:\s*"true"/.test(wrangler)) throw new Error('Repository defaults must not enable premium providers.');
for (const marker of ['reader profiles disabled', 'public registration disabled', 'No authentication setting is activated']) {
  if (!docs.includes(marker)) throw new Error(`Build 015 documentation missing safety statement: ${marker}`);
}

console.log('Build 015 access-readiness foundation remains valid for the current owner build.');
