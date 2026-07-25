import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ZERO_COST_MODE,
  containsSecret,
  extractAnswer,
  isPremiumProvider,
  premiumEnabled,
  providerStatus,
  requiresFreshResearch,
  selectRoute,
  uniqueCitations
} from '../src/router.js';

test('freshness detector covers English and Tamil current-information queries', () => {
  assert.equal(requiresFreshResearch('Who is the current chief minister?'), true);
  assert.equal(requiresFreshResearch('இன்றைய தமிழ்நாடு முதல்வர் யார்?'), true);
  assert.equal(requiresFreshResearch('Explain virtualisation fundamentals.'), false);
});

test('router sends current information to free research and routine work to edge', () => {
  const research = selectRoute({ prompt: 'Latest news today', mode: 'automatic', provider: 'auto' });
  assert.equal(research.kind, 'research');
  assert.equal(research.provider, 'free-research');
  assert.equal(research.reason, 'freshness-required-free-only');
  assert.equal(research.budgetClass, 'free-research');

  const chat = selectRoute({ prompt: 'Draft a migration checklist', mode: 'document', provider: 'auto', budget: 'balanced' });
  assert.equal(chat.kind, 'chat');
  assert.equal(chat.provider, 'workers-ai');
  assert.equal(chat.zeroCostMode, true);
});

test('zero-cost mode cannot be enabled by configuration and blocks every paid provider', () => {
  assert.equal(ZERO_COST_MODE, true);
  assert.equal(premiumEnabled({}), false);
  assert.equal(premiumEnabled({ PREMIUM_PROVIDERS_ENABLED: 'true' }), false);

  for (const provider of ['openai', 'anthropic', 'gemini', 'kimi']) {
    assert.equal(isPremiumProvider(provider), true);
    const route = selectRoute({ prompt: 'Refactor this code', mode: 'coding', provider });
    assert.equal(route.provider, 'workers-ai');
    assert.equal(route.requestedProvider, provider);
    assert.equal(route.premiumBlocked, true);

    const status = providerStatus({ AI: {} }).find((item) => item.id === provider);
    assert.equal(status.selectable, false);
    assert.equal(status.live, false);
    assert.equal(status.health, 'disabled-zero-cost-policy');
    assert.equal(status.blockedByPolicy, true);
  }
});

test('premium budget is downgraded to economy edge routing', () => {
  const route = selectRoute({ prompt: 'Create a report', mode: 'document', provider: 'auto', budget: 'premium' });
  assert.equal(route.provider, 'workers-ai');
  assert.equal(route.budgetClass, 'economy');
  assert.equal(route.premiumBlocked, true);
  assert.equal(route.reason, 'premium-budget-disabled-zero-cost-mode');
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
