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

test('owner platform capabilities default to local free-first mode', async () => {
  const response = await entry.fetch(new Request(`${origin}/api/v1/platform/capabilities`), environment());
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.release, '0.10-owner-preview');
  assert.equal(body.persistenceMode, 'browser-indexeddb');
  assert.equal(body.costPolicy, 'free-first');
  assert.equal(body.publicRegistration, false);
  assert.equal(body.features.artifacts.docx, true);
  assert.equal(body.features.approvals.externalWrites, false);
  assert.equal(body.features.usageLedger.paidCallsBlocked, true);
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
});

test('mobile configuration exposes PWA and stable API paths without claiming native release', async () => {
  const response = await entry.fetch(new Request(`${origin}/api/v1/mobile/config`), environment());
  const body = await response.json();
  assert.equal(body.currentClient, 'installable PWA');
  assert.equal(body.nativeClients.android, 'not-released');
  assert.equal(body.endpoints.chat, '/api/v1/chat');
});
