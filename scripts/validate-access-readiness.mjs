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
  if (!fs.existsSync(path)) throw new Error(`Missing Build 015 file: ${path}`);
}

const ownerApi = fs.readFileSync('src/owner-api.js', 'utf8');
const readiness = fs.readFileSync('assets/access-readiness.js', 'utf8');
const labels = fs.readFileSync('assets/release-labels.js', 'utf8');
const serviceWorker = fs.readFileSync('service-worker.js', 'utf8');
const openapi = fs.readFileSync('openapi/sakthiai-v1.yaml', 'utf8');
const wrangler = fs.readFileSync('wrangler.jsonc', 'utf8');
const docs = fs.readFileSync('docs/BUILD_015_ACCESS_READINESS.md', 'utf8');

for (const marker of [
  '0.15.0-access-readiness',
  '/api/v1/platform/release',
  'readerProfilesEnabled: false',
  'memberInvitationsEnabled: false',
  'serverHardQuotaEnabled: false',
  'paidFallbackEnabled: false',
  'publicRegistration: false',
  'serverWritesAllowed: false'
]) {
  if (!ownerApi.includes(marker)) throw new Error(`Owner release contract missing marker: ${marker}`);
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
if (!labels.includes('Owner build 015')) throw new Error('Owner Build 015 label is missing.');
for (const asset of ['/assets/access-readiness.js', '/assets/access-readiness.css']) {
  if (!serviceWorker.includes(asset)) throw new Error(`Service worker does not cache ${asset}`);
}
if (!serviceWorker.includes('sakthiai-owner-v15-access-readiness')) throw new Error('Build 015 cache rotation is missing.');
if (!openapi.includes('/api/v1/platform/release:') || !openapi.includes('0.15.0-access-readiness')) {
  throw new Error('OpenAPI release-readiness contract is missing.');
}
if (/"ACCESS_JWT_ENFORCEMENT_ENABLED"\s*:\s*"true"/.test(wrangler)) throw new Error('Build 015 must not activate Access JWT enforcement.');
if (/"PUBLIC_REGISTRATION"\s*:\s*"true"/.test(wrangler)) throw new Error('Build 015 must not enable public registration.');
if (/"PREMIUM_PROVIDERS_ENABLED"\s*:\s*"true"/.test(wrangler)) throw new Error('Build 015 must not enable premium providers.');
for (const marker of ['reader profiles disabled', 'public registration disabled', 'No authentication setting is activated']) {
  if (!docs.includes(marker)) throw new Error(`Build 015 documentation missing safety statement: ${marker}`);
}

console.log('Build 015 access readiness, release contract and safety validation passed.');
