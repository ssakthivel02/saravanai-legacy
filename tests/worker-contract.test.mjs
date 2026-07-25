import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/worker.js';

const origin = 'https://sakthiai.omsaravanabhava.org';

function streamResponse(text = 'Streamed test response') {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ response: text })}\n\n`));
      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    }
  });
}

function environment(overrides = {}) {
  return {
    AI_GATEWAY_ID: 'default',
    AI: {
      async run(model, input) {
        if (input.tools?.some((tool) => String(tool.type).includes('web_search'))) {
          return {
            content: [
              { type: 'server_tool_use', name: 'web_search', search_query: 'current verified test' },
              {
                type: 'web_search_tool_result',
                content: [{
                  type: 'web_search_result',
                  title: 'Official current source',
                  url: 'https://example.gov/current',
                  text: 'Current evidence returned by the search provider.'
                }]
              },
              { type: 'text', text: 'Fresh verified research response.' }
            ]
          };
        }
        if (input.stream) return streamResponse();
        assert.ok(Array.isArray(input.messages));
        return { response: `Verified response from ${model}` };
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

function post(path, body, extraHeaders = {}) {
  return new Request(`${origin}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Origin': origin,
      'X-Sakthi-Client': 'testclient12345',
      ...extraHeaders
    },
    body: JSON.stringify(body)
  });
}

test('status endpoint reports Release 003 routing and research capabilities', async () => {
  const response = await worker.fetch(new Request(`${origin}/api/v1/status`), environment());
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.status, 'ok');
  assert.equal(body.release, '0.3.0');
  assert.equal(body.aiRuntime, true);
  assert.ok(body.capabilities.includes('fresh web research'));
  assert.ok(body.capabilities.includes('streaming chat'));
  assert.ok(body.requestId);
});

test('normal chat uses the cost-first Sakthi Edge route', async () => {
  const response = await worker.fetch(post('/api/v1/chat', {
    prompt: 'Create a secure plan.',
    mode: 'coding',
    provider: 'auto',
    budget: 'balanced'
  }), environment());
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.match(body.answer, /Verified response/);
  assert.equal(body.provider, 'workers-ai');
  assert.equal(body.routing.reason, 'cost-first-default');
  assert.equal(body.mode, 'coding');
});

test('current-information query automatically uses live research and citations', async () => {
  const response = await worker.fetch(post('/api/v1/chat', {
    prompt: 'Who is the current chief minister today?',
    mode: 'automatic',
    provider: 'auto'
  }), environment());
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.kind, 'research');
  assert.equal(body.searchGrounded, true);
  assert.equal(body.provider, 'anthropic');
  assert.equal(body.answer, 'Fresh verified research response.');
  assert.equal(body.citations[0].url, 'https://example.gov/current');
});

test('stream endpoint returns server-sent events and routing headers', async () => {
  const response = await worker.fetch(post('/api/v1/chat/stream', {
    prompt: 'Write a short greeting.',
    mode: 'automatic',
    provider: 'workers-ai'
  }), environment());
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /text\/event-stream/);
  assert.equal(response.headers.get('X-Sakthi-Provider'), 'workers-ai');
  const body = await response.text();
  assert.match(body, /Streamed test response/);
  assert.match(body, /\[DONE\]/);
});

test('current-information failure never falls back to stale edge memory', async () => {
  let edgeCalled = false;
  const env = environment({
    AI: {
      async run(model) {
        if (model.startsWith('@cf/')) edgeCalled = true;
        throw new Error('Unified billing unavailable');
      }
    }
  });
  const response = await worker.fetch(post('/api/v1/chat', {
    prompt: 'Tell me the latest news today.',
    mode: 'automatic'
  }), env);
  assert.equal(response.status, 503);
  const body = await response.json();
  assert.equal(body.code, 'FRESH_RESEARCH_UNAVAILABLE');
  assert.equal(edgeCalled, false);
});

test('possible credentials are blocked before model execution', async () => {
  let called = false;
  const env = environment({
    AI: {
      async run() {
        called = true;
        return { response: 'should not run' };
      }
    }
  });
  const response = await worker.fetch(post('/api/v1/chat', {
    prompt: 'api_key = sk-abcdefghijklmnopqrstuvwxyz123456'
  }), env);
  assert.equal(response.status, 422);
  const body = await response.json();
  assert.equal(body.code, 'SECRET_DETECTED');
  assert.equal(called, false);
});

test('chat endpoint rejects cross-origin requests', async () => {
  const response = await worker.fetch(post('/api/v1/chat', { prompt: 'Test' }, { Origin: 'https://example.com' }), environment());
  assert.equal(response.status, 403);
  const body = await response.json();
  assert.equal(body.code, 'ORIGIN_DENIED');
});

test('chat endpoint enforces the configured rate limit', async () => {
  const response = await worker.fetch(post('/api/v1/chat', { prompt: 'Test' }), environment({
    SAKTHI_CHAT_RATE_LIMIT: {
      async limit() {
        return { success: false };
      }
    }
  }));
  assert.equal(response.status, 429);
  const body = await response.json();
  assert.equal(body.code, 'RATE_LIMITED');
  assert.equal(response.headers.get('Retry-After'), '60');
});
