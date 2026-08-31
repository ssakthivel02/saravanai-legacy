import fs from 'node:fs';

const required = [
  'src/access-policy.js','src/access-jwt.js','src/owner-api.js','assets/access-role-policy.js','assets/access-role-policy.css','assets/release-labels.js','service-worker.js','openapi/sakthiai-v1.yaml','tests/access-policy.test.mjs','tests/access-role-policy-ui.test.mjs','tests/access-jwt.test.mjs','tests/platform-release-contract.test.mjs','docs/BUILD_016_ACCESS_ROLE_POLICY.md','ACCESS_ROLE_POLICY_BASELINE.json'
];
for (const path of required) if (!fs.existsSync(path)) throw new Error(`Missing Build 016 file: ${path}`);

const policy = fs.readFileSync('src/access-policy.js', 'utf8');
const auth = fs.readFileSync('src/access-jwt.js', 'utf8');
const ownerApi = fs.readFileSync('src/owner-api.js', 'utf8');
const ui = fs.readFileSync('assets/access-role-policy.js', 'utf8');
const labels = fs.readFileSync('assets/release-labels.js', 'utf8');
const serviceWorker = fs.readFileSync('service-worker.js', 'utf8');
const openapi = fs.readFileSync('openapi/sakthiai-v1.yaml', 'utf8');
const wrangler = fs.readFileSync('wrangler.jsonc', 'utf8');
const docs = fs.readFileSync('docs/BUILD_016_ACCESS_ROLE_POLICY.md', 'utf8');
const baseline = JSON.parse(fs.readFileSync('ACCESS_ROLE_POLICY_BASELINE.json', 'utf8'));

for (const marker of ['access-role-policy-foundation-1.0.0','ACCESS_TEAM_PROFILES_ENABLED','ACCESS_READER_PROFILES_ENABLED','ACCESS_ROLE_POLICY_INVALID','ACCESS_TEAM_PROFILES_DISABLED','ACCESS_READER_PROFILES_DISABLED','invitationRequestsActive: false','publicRegistration: false','serverRoleEnforcementEnabled: false','sharedPersistenceEnabled: false']) {
  if (!policy.includes(marker)) throw new Error(`Access policy missing marker: ${marker}`);
}
for (const marker of ["from './access-policy.js'",'resolveConfiguredRole','ACCESS_ROLE_POLICY_INVALID','x-sakthiai-access-role','accessPolicyRelease']) {
  if (!auth.includes(marker)) throw new Error(`JWT role enforcement missing marker: ${marker}`);
}
for (const marker of ['0.16.0-role-policy','const OWNER_BUILD = 16','/api/v1/platform/access/readiness','accessPolicySummary','fullEmailExposed: false','profileKeyExposed: false','invitationsActive: false','paidFallbackEnabled: false']) {
  if (!ownerApi.includes(marker)) throw new Error(`Owner API missing Build 016 marker: ${marker}`);
}
for (const marker of ['deriveRolePolicyView','/api/v1/platform/access/readiness','Owner Build 016','Controlled invitation boundary']) {
  if (!ui.includes(marker)) throw new Error(`Role policy UI missing marker: ${marker}`);
}
if (!labels.includes("import './access-role-policy.js'")) throw new Error('Role policy module is not loaded by the current UI chain.');
if (!/Owner build 0?(?:1[6-9]|[2-9]\d)/i.test(labels)) throw new Error('Current owner build label must be 016 or later.');
for (const asset of ['/assets/access-role-policy.js','/assets/access-role-policy.css']) if (!serviceWorker.includes(asset)) throw new Error(`Service worker does not cache ${asset}`);
if (!/(?:sakthiai|saravanai)-owner-v(?:1[6-9]|[2-9]\d)-/.test(serviceWorker)) throw new Error('Build 016-or-later PWA cache rotation is missing under the compatible SakthiAI/SaravanAI cache identity.');
if (!openapi.includes('/api/v1/platform/access/readiness:') || !/version: 0\.(?:1[6-9]|[2-9]\d)\./.test(openapi)) throw new Error('OpenAPI Build 016-or-later role-policy contract is missing.');

for (const variable of ['ACCESS_JWT_ENFORCEMENT_ENABLED','ACCESS_TEAM_PROFILES_ENABLED','ACCESS_READER_PROFILES_ENABLED','ACCESS_INVITATIONS_ENABLED','PUBLIC_REGISTRATION','PREMIUM_PROVIDERS_ENABLED']) {
  if (new RegExp(`"${variable}"\\s*:\\s*"true"`).test(wrangler)) throw new Error(`Repository default must not enable ${variable}.`);
}
if (baseline.policy.teamProfilesEnabledByDefault !== false) throw new Error('Team profiles must remain disabled by default.');
if (baseline.policy.readerProfilesEnabledByDefault !== false) throw new Error('Reader profiles must remain disabled by default.');
if (baseline.policy.invitationRequestsActive !== false) throw new Error('Invitation requests must remain inactive.');
if (baseline.policy.publicRegistration !== false) throw new Error('Public registration must remain disabled.');
if (baseline.policy.sharedPersistenceEnabled !== false) throw new Error('Shared persistence must remain disabled.');
if (baseline.cost.paidServicesRequired !== false || baseline.cost.paidFallbackEnabled !== false) throw new Error('Build 016 must not require or silently activate paid services.');
for (const marker of ['Public registration remains disabled','Team profiles remain disabled by default','Reader profiles remain disabled by default','No authentication setting is activated automatically']) {
  if (!docs.includes(marker)) throw new Error(`Build 016 documentation missing safety statement: ${marker}`);
}
console.log('Build 016 access role policy remains valid for the current owner build.');
