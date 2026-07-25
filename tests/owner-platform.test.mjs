import test from 'node:test';
import assert from 'node:assert/strict';
import entry from '../src/entry.js';

const origin = 'https://sakthiai.omsaravanabhava.org';

function environment(overrides = {}) {
  return {
    AI: { async run() { return { response: 'ok' }; } },
    ASSETS: { async fetch() { return new Response('asset'); } },
    ...overrides
  };
}

test('owner platform capabilities default to locked local free-first mode', async () => {
  const response = await entry.fetch(new Request(`${origin}/api/v1/platform/capabilities`), environment());
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.release, '0.11.0-owner-security');
  assert.equal(body.persistenceMode, 'browser-indexeddb');
  assert.equal(body.costPolicy, 'free-first');
  assert.equal(body.publicRegistration, false);
  assert.equal(body.features.projects.privacyLock, true);
  assert.equal(body.features.conversations.encryptedExport, true);
  assert.equal(body.features.backupSecurity.aes256Gcm, true);
  assert.equal(body.features.backupSecurity.plaintextExport, false);
  assert.equal(body.features.approvals.externalWrites, false);
  assert.equal(body.features.usageLedger.paidCallsBlocked, true);
  assert.equal(body.bindings.kimiEnabled, false);
});

test('optional D1 binding changes capability state without enabling public access', async () => {
  const response = await entry.fetch(new Request(`${origin}/api/v1/platform/capabilities`), environment({
    SAKTHI_DB: { prepare() { return {}; } }
  }));
  const body = await response.json();
  assert.equal(body.persistenceMode, 'server-d1');
  assert.equal(body.publicRegistration, false);
});

test('session endpoint does not claim authentication without Access headers', async () => {
  const response = await entry.fetch(new Request(`${origin}/api/v1/platform/session`), environment());
  const body = await response.json();
  assert.equal(body.mode, 'local-owner-preview');
  assert.equal(body.identity.authenticated, false);
  assert.equal(body.serverWritesAllowed, false);
  assert.equal(body.localPrivacyLock, true);
  assert.equal(body.encryptedBackups, true);
});

test('mobile configuration exposes PWA and stable API paths without claiming native release', async () => {
  const response = await entry.fetch(new Request(`${origin}/api/v1/mobile/config`), environment());
  const body = await response.json();
  assert.equal(body.currentClient, 'installable PWA');
  assert.equal(body.nativeClients.android, 'not-released');
  assert.equal(body.endpoints.chat, '/api/v1/chat');
  assert.equal(body.endpoints.health, '/health');
});

test('root health path returns JSON and confirms paid providers and Kimi are disabled', async () => {
  const response = await entry.fetch(new Request(`${origin}/health`), environment({
    PREMIUM_PROVIDERS_ENABLED: 'true'
  }));
  assert.match(response.headers.get('content-type') || '', /application\/json/);
  const body = await response.json();
  assert.equal(body.release, '0.11.0-owner-security');
  assert.equal(body.premiumProvidersEnabled, false);
  assert.equal(body.kimiEnabled, false);
  assert.equal(body.publicRegistration, false);
});
