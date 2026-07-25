import test from 'node:test';
import assert from 'node:assert/strict';
import {
  containsSecret,
  extractAnswer,
  requiresFreshResearch,
  selectRoute,
  uniqueCitations
} from '../src/router.js';

test('freshness detector covers English and Tamil current-information queries', () => {
  assert.equal(requiresFreshResearch('Who is the current chief minister?'), true);
  assert.equal(requiresFreshResearch('இன்றைய தமிழ்நாடு முதல்வர் யார்?'), true);
  assert.equal(requiresFreshResearch('Explain virtualisation fundamentals.'), false);
});

test('router sends current information to research and routine work to edge', () => {
  const research = selectRoute({ prompt: 'Latest news today', mode: 'automatic', provider: 'auto' });
  assert.equal(research.kind, 'research');
  assert.equal(research.provider, 'anthropic');
  assert.equal(research.reason, 'freshness-required');

  const chat = selectRoute({ prompt: 'Draft a migration checklist', mode: 'document', provider: 'auto', budget: 'balanced' });
  assert.equal(chat.kind, 'chat');
  assert.equal(chat.provider, 'workers-ai');
});

test('premium user override and budget routes are explicit', () => {
  assert.equal(selectRoute({ prompt: 'Refactor this code', mode: 'coding', provider: 'openai' }).provider, 'openai');
  assert.equal(selectRoute({ prompt: 'Refactor this code', mode: 'coding', provider: 'auto', budget: 'premium' }).provider, 'openai');
  assert.equal(selectRoute({ prompt: 'Create a report', mode: 'document', provider: 'auto', budget: 'premium' }).provider, 'gemini');
});

test('secret detector rejects credential-shaped values', () => {
  assert.equal(containsSecret('password = my-secret-value'), true);
  assert.equal(containsSecret('-----BEGIN PRIVATE KEY-----'), true);
  assert.equal(containsSecret('Explain password rotation policy without credentials.'), false);
});

test('citation extraction deduplicates URLs', () => {
  const citations = uniqueCitations({
    content: [
      { url: 'https://example.com/a', title: 'A', text: 'One' },
      { source_url: 'https://example.com/a', source_title: 'A duplicate' },
      { uri: 'https://example.com/b', name: 'B' }
    ]
  });
  assert.equal(citations.length, 2);
  assert.equal(citations[0].index, 1);
  assert.equal(citations[1].url, 'https://example.com/b');
});

test('answer extraction supports Workers AI, Anthropic and OpenAI-style responses', () => {
  assert.equal(extractAnswer({ response: 'edge' }), 'edge');
  assert.equal(extractAnswer({ content: [{ type: 'text', text: 'anthropic' }] }), 'anthropic');
  assert.equal(extractAnswer({ output: [{ content: [{ type: 'output_text', text: 'openai' }] }] }), 'openai');
});
