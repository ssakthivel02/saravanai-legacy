import fs from 'node:fs';

const required = [
  'src/access-route-catalogue.js','src/access-authorizer.js','src/access-denial.js','src/access-audit-contract.js','src/platform-release-017.js','src/entry.js',
  'assets/access-authorisation.js','assets/access-authorisation.css','assets/release-labels.js','assets/access-readiness.js','service-worker.js',
  'openapi/sakthiai-v1.yaml','openapi/sakthiai-access-v1.yaml',
  'tests/access-route-catalogue.test.mjs','tests/access-authorizer.test.mjs','tests/access-denial.test.mjs','tests/access-audit-contract.test.mjs','tests/access-authorisation-ui.test.mjs','tests/platform-release-017.test.mjs',
  'docs/BUILD_017_ACCESS_AUTHORISATION.md','docs/BUILD_017_HLD.md','docs/BUILD_017_LLD.md','docs/BUILD_017_THREAT_MODEL.md','docs/BUILD_017_ROLLOUT_ROLLBACK.md','ACCESS_AUTHORISATION_BASELINE.json'
];
for (const path of required) if (!fs.existsSync(path)) throw new Error(`Missing Build 017 file: ${path}`);

const catalogue = fs.readFileSync('src/access-route-catalogue.js', 'utf8');
const authorizer = fs.readFileSync('src/access-authorizer.js', 'utf8');
const denial = fs.readFileSync('src/access-denial.js', 'utf8');
const audit = fs.readFileSync('src/access-audit-contract.js', 'utf8');
const overlay = fs.readFileSync('src/platform-release-017.js', 'utf8');
const entry = fs.readFileSync('src/entry.js', 'utf8');
const ui = fs.readFileSync('assets/access-authorisation.js', 'utf8');
const labels = fs.readFileSync('assets/release-labels.js', 'utf8');
const readiness = fs.readFileSync('assets/access-readiness.js', 'utf8');
const serviceWorker = fs.readFileSync('service-worker.js', 'utf8');
const openapi = fs.readFileSync('openapi/sakthiai-v1.yaml', 'utf8');
const dedicatedOpenapi = fs.readFileSync('openapi/sakthiai-access-v1.yaml', 'utf8');
const wrangler = fs.readFileSync('wrangler.jsonc', 'utf8');
const baseline = JSON.parse(fs.readFileSync('ACCESS_AUTHORISATION_BASELINE.json', 'utf8'));
const docs = fs.readFileSync('docs/BUILD_017_ACCESS_AUTHORISATION.md', 'utf8');

for (const marker of ['endpoint-authorisation-foundation-1.0.0','deny-unclassified-when-enabled','unclassified-protected-route','owner-authorisation-readiness','serverMutation']) {
  if (!catalogue.includes(marker)) throw new Error(`Route catalogue missing marker: ${marker}`);
}
for (const marker of ['ACCESS_ROUTE_AUTHORIZATION_ENABLED','ACCESS_SERVER_MUTATIONS_ENABLED','ACCESS_VERIFIED_IDENTITY_REQUIRED','ACCESS_ROLE_NOT_AUTHORISED','ACCESS_ROUTE_UNCLASSIFIED','ACCESS_SERVER_MUTATIONS_DISABLED']) {
  if (!authorizer.includes(marker)) throw new Error(`Authorizer missing marker: ${marker}`);
}
for (const marker of ['Cache-Control','no-store','publicRegistration: false']) if (!denial.includes(marker)) throw new Error(`Safe denial contract missing marker: ${marker}`);
for (const marker of ['identityIncluded: false','emailIncluded: false','tokenIncluded: false',"persistence: 'none-contract-only'"]) if (!audit.includes(marker)) throw new Error(`Audit contract missing marker: ${marker}`);
for (const marker of ['0.17.0-endpoint-authorisation','OWNER_BUILD_017 = 17','/api/v1/platform/access/authorisation','serverRoleEnforcementEnabled','serverWritesAllowed']) if (!overlay.includes(marker)) throw new Error(`Build 017 overlay missing marker: ${marker}`);
for (const marker of ['enforceRouteAuthorisation','handleBuild017PlatformApi']) if (!entry.includes(marker)) throw new Error(`Entry integration missing marker: ${marker}`);
for (const marker of ['deriveAuthorisationView','/api/v1/platform/access/authorisation','Owner Build 017']) if (!ui.includes(marker)) throw new Error(`Authorisation UI missing marker: ${marker}`);

if (!labels.includes("import './access-authorisation.js'")) throw new Error('Build 017 UI module is not loaded.');
if (!labels.includes('Owner build 017')) throw new Error('Owner Build 017 label is missing.');
if (!readiness.includes('Endpoint authorisation')) throw new Error('Access readiness does not show endpoint authorisation state.');
for (const asset of ['/assets/access-authorisation.js','/assets/access-authorisation.css']) if (!serviceWorker.includes(asset)) throw new Error(`Service worker does not cache ${asset}`);
if (!serviceWorker.includes('sakthiai-owner-v17-endpoint-authorisation')) throw new Error('Build 017 PWA cache rotation is missing.');
if (!openapi.includes('/api/v1/platform/access/authorisation:') || !openapi.includes('0.17.0-endpoint-authorisation')) throw new Error('Primary OpenAPI Build 017 contract is missing.');
if (!dedicatedOpenapi.includes('deny-unclassified-when-enabled')) throw new Error('Dedicated access OpenAPI contract is incomplete.');

for (const variable of ['ACCESS_JWT_ENFORCEMENT_ENABLED','ACCESS_ROUTE_AUTHORIZATION_ENABLED','ACCESS_SERVER_MUTATIONS_ENABLED','ACCESS_TEAM_PROFILES_ENABLED','ACCESS_READER_PROFILES_ENABLED','ACCESS_INVITATIONS_ENABLED','PUBLIC_REGISTRATION','PREMIUM_PROVIDERS_ENABLED']) {
  if (new RegExp(`"${variable}"\\s*:\\s*"true"`).test(wrangler)) throw new Error(`Repository default must not enable ${variable}.`);
}
if (baseline.activation.routeAuthorisationEnabledByDefault !== false) throw new Error('Route authorisation must remain disabled by default.');
if (baseline.activation.serverMutationsEnabledByDefault !== false) throw new Error('Server mutations must remain disabled by default.');
if (baseline.activation.auditPersistenceEnabled !== false) throw new Error('Audit persistence must remain disabled.');
if (baseline.safety.paidFallbackEnabled !== false) throw new Error('Paid fallback must remain disabled.');
for (const marker of ['Route authorisation remains disabled by default','Server mutations remain disabled by default','No Cloudflare Access setting is changed automatically','No audit event is persisted']) {
  if (!docs.includes(marker)) throw new Error(`Build 017 documentation missing safety statement: ${marker}`);
}
console.log('Build 017 endpoint authorisation, default-deny catalogue and safety validation passed.');
