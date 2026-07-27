import fs from 'node:fs';

const required = [
  'assets/voice-input.js',
  'assets/voice-input.css',
  'assets/release-labels.js',
  'service-worker.js',
  '_headers',
  'tests/voice-input.test.mjs',
  'VOICE_INPUT_BASELINE.json',
  'docs/VOICE_INPUT_AND_LOGIN_UX_PLAN.md',
  '.github/workflows/voice-input-validation.yml'
];

for (const path of required) {
  if (!fs.existsSync(path)) throw new Error(`Missing voice-input release file: ${path}`);
}

const voice = fs.readFileSync('assets/voice-input.js', 'utf8');
const labels = fs.readFileSync('assets/release-labels.js', 'utf8');
const serviceWorker = fs.readFileSync('service-worker.js', 'utf8');
const headers = fs.readFileSync('_headers', 'utf8');
const baseline = JSON.parse(fs.readFileSync('VOICE_INPUT_BASELINE.json', 'utf8'));

for (const marker of ['SpeechRecognition', 'webkitSpeechRecognition', 'ta-IN', 'never auto-submitted', 'does not store the recording']) {
  if (!voice.includes(marker)) throw new Error(`Voice input missing marker: ${marker}`);
}
if (!labels.includes("import './voice-input.js'")) throw new Error('Voice input is not loaded by the current UI module chain.');
for (const asset of ['/assets/voice-input.js', '/assets/voice-input.css']) {
  if (!serviceWorker.includes(asset)) throw new Error(`Service worker does not cache ${asset}`);
}
if (!headers.includes('microphone=(self)')) throw new Error('Same-origin microphone permission is not enabled.');
if (headers.includes('max-age=31536000, immutable')) throw new Error('Non-fingerprinted assets must not use year-long immutable caching.');
if (!headers.includes('max-age=0, must-revalidate')) throw new Error('Asset cache revalidation policy is missing.');

if (baseline.behaviour.autoSubmit !== false) throw new Error('Voice input must not submit automatically.');
if (baseline.behaviour.audioStoredBySakthiAI !== false) throw new Error('Browser voice mode must not claim audio storage.');
if (baseline.cost.paidProviderRequired !== false) throw new Error('A paid provider must not be required.');
if (baseline.safety.publicRegistrationChanged !== false) throw new Error('Public registration must remain unchanged.');
if (baseline.safety.authenticationActivationChanged !== false) throw new Error('Authentication activation must remain unchanged.');

console.log('Voice input, release currency and cache-safety validation passed.');
