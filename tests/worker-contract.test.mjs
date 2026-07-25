import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/worker.js';

const origin = 'https://sakthiai.omsaravanabhava.org';

function environment(overrides = {}) {
  return {
    AI: {
      async run(model, input) {
        assert.equal(model, '@cf/meta/llama-3.1-8b-instruct-fast');
        assert.ok(Array.isArray(input.messages));
        return { response: 'Verified test response' };
      }
    },
    SAKTHI_CHAT_RATE_LIMIT: {
      async limit() {
        return { success: true };
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

test('status endpoint reports the live AI runtime', async () => {
  const response = await worker.fetch(new Request(`${origin}/api/v1/status`), environment());
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.status, 'ok');
  assert.equal(body.release, '0.2.0');
  assert.equal(body.aiRuntime, true);
  assert.ok(body.requestId);
});

test('chat endpoint returns a normalised SakthiAI response', async () => {
  const response = await worker.fetch(new Request(`${origin}/api/v1/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Origin': origin
    },
    body: JSON.stringify({ prompt: 'Create a secure plan.', mode: 'coding', provider: 'auto' })
  }), environment());
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.answer, 'Verified test response');
  assert.equal(body.provider, 'workers-ai');
  assert.equal(body.mode, 'coding');
  assert.ok(body.requestId);
});

test('chat endpoint rejects cross-origin requests', async () => {
  const response = await worker.fetch(new Request(`${origin}/api/v1/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Origin': 'https://example.com'
    },
    body: JSON.stringify({ prompt: 'Test' })
  }), environment());
  assert.equal(response.status, 403);
  const body = await response.json();
  assert.equal(body.code, 'ORIGIN_DENIED');
});

test('chat endpoint enforces the configured rate limit', async () => {
  const response = await worker.fetch(new Request(`${origin}/api/v1/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Origin': origin
    },
    body: JSON.stringify({ prompt: 'Test' })
  }), environment({
    SAKTHI_CHAT_RATE_LIMIT: {
      async limit() {
        return { success: false };
      }
    }
  }));
  assert.equal(response.status, 429);
  const body = await response.json();
  assert.equal(body.code, 'RATE_LIMITED');
});
