import fs from 'node:fs';

const required = [
  'assets/profile-context.js',
  'assets/profile-bootstrap.js',
  'assets/release-labels.js',
  'service-worker.js',
  'tests/profile-context.test.mjs',
  'docs/AUTHENTICATED_BROWSER_PROFILE_ISOLATION.md',
  'PROFILE_ISOLATION_BASELINE.json',
  '.github/workflows/profile-isolation-validation.yml'
];

for (const path of required) {
  if (!fs.existsSync(path)) throw new Error(`Missing profile isolation file: ${path}`);
}

const context = fs.readFileSync('assets/profile-context.js', 'utf8');
const bootstrap = fs.readFileSync('assets/profile-bootstrap.js', 'utf8');
const labels = fs.readFileSync('assets/release-labels.js', 'utf8');
const zip = fs.readFileSync('assets/zip.js', 'utf8');
const capture = fs.readFileSync('assets/task-capture.js', 'utf8');
const serviceWorker = fs.readFileSync('service-worker.js', 'utf8');
const baseline = JSON.parse(fs.readFileSync('PROFILE_ISOLATION_BASELINE.json', 'utf8'));

for (const marker of ['profile-[a-f0-9]{24}', 'sakthiai-owner-platform-', 'credentials: \'same-origin\'', 'legacyCompatible']) {
  if (!context.includes(marker)) throw new Error(`Profile context missing marker: ${marker}`);
}
for (const marker of ['IDBFactory.prototype', 'Storage.prototype', 'sakthiai-owner-lock-v1', 'sakthiai-owner-unlocked-until']) {
  if (!bootstrap.includes(marker)) throw new Error(`Profile bootstrap missing marker: ${marker}`);
}
if (!labels.includes("import './profile-bootstrap.js'")) throw new Error('Release labels must initialise profile bootstrap.');
if (!zip.includes("import './task-capture.js'")) throw new Error('Owner platform dependency path to task capture changed unexpectedly.');
if (!capture.includes("import './release-labels.js'")) throw new Error('Task capture must initialise release labels before owner security.');
for (const asset of ['/assets/profile-context.js', '/assets/profile-bootstrap.js']) {
  if (!serviceWorker.includes(asset)) throw new Error(`Service worker does not cache ${asset}`);
}

if (baseline.activation.defaultPublicRegistration !== false) throw new Error('Public registration must remain disabled.');
if (baseline.activation.databaseMigrationExecuted !== false) throw new Error('No database migration may be executed.');
if (baseline.activation.serverPersistenceEnabled !== false) throw new Error('Server persistence must remain disabled.');
if (baseline.legacyCompatibility.automaticLegacyDataCopy !== false) throw new Error('Legacy data must not be copied automatically.');
if (baseline.safety.runtimeWavesChanged !== false) throw new Error('Runtime waves must remain unchanged.');

console.log('Authenticated browser profile isolation structural validation passed.');
