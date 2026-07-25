import test from 'node:test';
import assert from 'node:assert/strict';
import entry from '../src/entry.js';

const origin = 'https://sakthiai.omsaravanabhava.org';

function coreEnvironment(overrides = {}) {
  return {
    AI: {
      async run() {
        return { response: 'ok' };
      }
    },
    ASSETS: {
      async fetch() {
        return new Response('asset');
      }
    },
    ...overrides
  };
}

test('file capabilities are visible without exposing upload access', async () => {
  const response = await entry.fetch(new Request(`${origin}/api/v1/files/capabilities`), coreEnvironment());
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.release, '0.4.0-preview');
  assert.equal(body.configured.privateStorage, false);
  assert.equal(body.limits.anonymousUpload, false);
  assert.ok(body.requiredBindings.includes('EVIDENCE_BUCKET'));
});

test('file upload remains disabled until private storage is configured', async () => {
  const response = await entry.fetch(new Request(`${origin}/api/v1/files/upload`, {
    method: 'POST',
    body: new FormData()
  }), coreEnvironment());
  assert.equal(response.status, 503);
  const body = await response.json();
  assert.equal(body.code, 'FILES_NOT_CONFIGURED');
});

test('configured storage still requires an ingestion secret', async () => {
  const response = await entry.fetch(new Request(`${origin}/api/v1/files/upload`, {
    method: 'POST',
    body: new FormData()
  }), coreEnvironment({
    EVIDENCE_BUCKET: {
      async put() {},
      async get() { return null; },
      async delete() {}
    }
  }));
  assert.equal(response.status, 401);
  const body = await response.json();
  assert.equal(body.code, 'INGEST_UNAUTHORISED');
});
