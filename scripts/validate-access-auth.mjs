import fs from 'node:fs';

const required = [
  'src/access-jwt.js',
  'src/entry.js',
  'src/owner-api.js',
  'tests/access-jwt.test.mjs',
  'docs/ACCESS_AUTH_PROFILE_FOUNDATION.md',
  'ACCESS_AUTH_PROFILE_FOUNDATION_BASELINE.json',
  '.github/workflows/access-auth-profile-validation.yml'
];

for (const path of required) {
  if (!fs.existsSync(path)) throw new Error(`Missing required authentication foundation file: ${path}`);
}

const entry = fs.readFileSync('src/entry.js', 'utf8');
const auth = fs.readFileSync('src/access-jwt.js', 'utf8');
const accessPolicy = fs.existsSync('src/access-policy.js') ? fs.readFileSync('src/access-policy.js', 'utf8') : '';
const ownerApi = fs.readFileSync('src/owner-api.js', 'utf8');
const baseline = JSON.parse(fs.readFileSync('ACCESS_AUTH_PROFILE_FOUNDATION_BASELINE.json', 'utf8'));

for (const marker of ['enforceAccessJwt', 'ACCESS_JWT_ENFORCEMENT_ENABLED']) {
  if (!entry.includes(marker) && !auth.includes(marker)) throw new Error(`Missing marker: ${marker}`);
}
for (const marker of ['RS256', 'ACCESS_TEAM_DOMAIN', 'ACCESS_AUD', 'profileKey']) {
  if (!auth.includes(marker)) throw new Error(`Missing authentication marker: ${marker}`);
}
if (!auth.includes('ACCESS_ALLOWED_EMAILS') && !accessPolicy.includes('ACCESS_ALLOWED_EMAILS')) {
  throw new Error('Missing backward-compatible exact-email allow-list marker: ACCESS_ALLOWED_EMAILS');
}
for (const marker of ['cryptographicallyVerified', 'profileIsolationReady', 'publicRegistration: false']) {
  if (!ownerApi.includes(marker)) throw new Error(`Missing owner API marker: ${marker}`);
}

if (baseline.activation.defaultEnabled !== false) throw new Error('Authentication enforcement must remain disabled by default.');
if (baseline.activation.publicRegistration !== false) throw new Error('Public registration must remain disabled.');
if (baseline.activation.databaseMigrationExecuted !== false) throw new Error('No database migration may be executed by this pack.');
if (baseline.cost.paidServicesRequired !== false) throw new Error('Paid services must not be required.');

console.log('Access authentication and profile foundation structural validation passed.');
