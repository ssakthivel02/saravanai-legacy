export const RELEASE = '0.11.0';
export const DEFAULT_GATEWAY = 'default';
export const ZERO_COST_MODE = true;

export const MODEL_CATALOG = {
  edge: {
    provider: 'workers-ai',
    label: 'Sakthi Edge',
    model: '@cf/meta/llama-3.1-8b-instruct-fast',
    costClass: 'included',
    webSearch: false
  },
  openai: {
    provider: 'openai',
    label: 'OpenAI',
    model: 'openai/gpt-5.4-mini',
    costClass: 'premium',
    webSearch: true
  },
  anthropic: {
    provider: 'anthropic',
    label: 'Claude',
    model: 'anthropic/claude-haiku-4.5',
    costClass: 'premium',
    webSearch: true
  },
  gemini: {
    provider: 'gemini',
    label: 'Gemini',
    model: 'google/gemini-3-flash',
    costClass: 'premium',
    webSearch: false
  },
  kimi: {
    provider: 'kimi',
    label: 'Kimi',
    model: '@cf/moonshotai/kimi-k2.6',
    costClass: 'premium',
    webSearch: false
  }
};

const PAID_PROVIDERS = new Set(['openai', 'anthropic', 'gemini', 'kimi']);

const currentSignals = [
  /\b(today|tonight|latest|current|currently|recent|recently|news|breaking|this week|this month|this year|now|live|price|weather|score|schedule|election|office holder|who is)\b/i,
  /\b(chief minister|prime minister|president|governor|ceo|cfo|cto|mayor|leader)\b/i,
  /\b(2025|2026|2027)\b/,
  /(இன்று|தற்போது|தற்போதைய|சமீபத்திய|செய்தி|முதல்வர்|முதலமைச்சர்|பிரதமர்|ஜனாதிபதி|தலைவர்|விலை|வானிலை)/i
];

const secretSignals = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/i,
  /\b(?:password|passwd|api[_ -]?key|secret|access[_ -]?token|refresh[_ -]?token|private[_ -]?key)\b\s*[:=]/i,
  /\bsk-[A-Za-z0-9_-]{20,}\b/,
  /\bAIza[A-Za-z0-9_-]{20,}\b/
];

export function requiresFreshResearch(prompt = '') {
  return currentSignals.some((pattern) => pattern.test(prompt));
}

export function containsSecret(prompt = '') {
  return secretSignals.some((pattern) => pattern.test(prompt));
}

export function normaliseMode(value) {
  return ['automatic', 'research', 'document', 'coding', 'website'].includes(value) ? value : 'automatic';
}

export function normaliseProvider(value) {
  return ['auto', 'free-research', 'workers-ai', 'openai', 'anthropic', 'gemini', 'kimi'].includes(value) ? value : 'auto';
}

export function isPremiumProvider(provider) {
  return PAID_PROVIDERS.has(provider);
}

export function premiumEnabled() {
  return false;
}

export function selectRoute({ prompt = '', mode = 'automatic', provider = 'auto', budget = 'economy' } = {}) {
  const safeMode = normaliseMode(mode);
  const safeProvider = normaliseProvider(provider);
  const fresh = safeMode === 'research' || requiresFreshResearch(prompt);

  if (fresh) {
    return {
      kind: 'research',
      provider: 'free-research',
      preferredPremiumProvider: null,
      reason: safeMode === 'research' ? 'research-mode-free-only' : 'freshness-required-free-only',
      freshnessRequired: true,
      budgetClass: 'free-research',
      zeroCostMode: true
    };
  }

  if (isPremiumProvider(safeProvider)) {
    return {
      kind: 'chat',
      provider: 'workers-ai',
      requestedProvider: safeProvider,
      reason: `paid-provider-disabled-${safeProvider}`,
      freshnessRequired: false,
      budgetClass: 'economy',
      premiumBlocked: true,
      zeroCostMode: true
    };
  }

  if (safeProvider === 'workers-ai') {
    return {
      kind: 'chat',
      provider: 'workers-ai',
      reason: 'user-selected-free-edge',
      freshnessRequired: false,
      budgetClass: 'economy',
      zeroCostMode: true
    };
  }

  if (budget === 'premium') {
    return {
      kind: 'chat',
      provider: 'workers-ai',
      reason: 'premium-budget-disabled-zero-cost-mode',
      freshnessRequired: false,
      budgetClass: 'economy',
      premiumBlocked: true,
      zeroCostMode: true
    };
  }

  return {
    kind: 'chat',
    provider: 'workers-ai',
    reason: budget === 'economy' ? 'economy-budget' : 'free-only-default',
    freshnessRequired: false,
    budgetClass: 'economy',
    zeroCostMode: true
  };
}

export function resolveModel(provider, env = {}) {
  const overrides = {
    'workers-ai': env.EDGE_MODEL,
    openai: env.OPENAI_MODEL,
    anthropic: env.ANTHROPIC_MODEL,
    gemini: env.GEMINI_MODEL,
    kimi: env.KIMI_MODEL
  };
  const key = provider === 'workers-ai' ? 'edge' : provider;
  const entry = MODEL_CATALOG[key] || MODEL_CATALOG.edge;
  return { ...entry, model: overrides[provider] || entry.model };
}

export function gatewayOptions(env = {}) {
  return { gateway: { id: env.AI_GATEWAY_ID || DEFAULT_GATEWAY } };
}

export function providerStatus(env = {}) {
  const hasAi = Boolean(env.AI);
  return [
    {
      id: 'auto',
      name: 'Automatic free-only routing',
      configured: hasAi,
      selectable: hasAi,
      live: hasAi,
      health: hasAi ? 'ready' : 'missing-binding',
      costClass: 'free-only'
    },
    {
      id: 'free-research',
      name: 'Free research · GDELT + Wikipedia',
      configured: hasAi,
      selectable: hasAi,
      live: hasAi,
      health: hasAi ? 'ready-with-source-limitations' : 'missing-binding',
      costClass: 'free-first',
      webSearch: true
    },
    ...Object.values(MODEL_CATALOG).map((entry) => {
      const paid = isPremiumProvider(entry.provider);
      const selectable = hasAi && !paid;
      return {
        id: entry.provider,
        name: entry.label,
        model: resolveModel(entry.provider, env).model,
        configured: selectable,
        selectable,
        live: selectable,
        health: !hasAi ? 'missing-binding' : paid ? 'disabled-zero-cost-policy' : 'ready',
        costClass: entry.costClass,
        webSearch: entry.webSearch,
        optionalPaid: paid,
        blockedByPolicy: paid
      };
    })
  ];
}

export function uniqueCitations(value) {
  const citations = [];
  const seen = new Set();

  function add(url, title = '', snippet = '') {
    if (typeof url !== 'string' || !/^https?:\/\//i.test(url) || seen.has(url)) return;
    seen.add(url);
    citations.push({
      index: citations.length + 1,
      url,
      title: typeof title === 'string' && title.trim() ? title.trim() : new URL(url).hostname,
      snippet: typeof snippet === 'string' ? snippet.trim().slice(0, 320) : ''
    });
  }

  function walk(node) {
    if (!node) return;
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (typeof node !== 'object') return;

    const url = node.url || node.uri || node.source_url || node.sourceUrl;
    const title = node.title || node.name || node.source_title || node.sourceTitle;
    const snippet = node.snippet || node.text || node.cited_text || node.citedText || '';
    if (url) add(url, title, snippet);

    Object.values(node).forEach(walk);
  }

  walk(value);
  return citations.slice(0, 12);
}

export function extractAnswer(value) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value.response === 'string') return value.response;
  if (typeof value.output_text === 'string') return value.output_text;

  if (Array.isArray(value.content)) {
    const text = value.content
      .filter((block) => block && (block.type === 'text' || block.type === 'output_text') && typeof block.text === 'string')
      .map((block) => block.text)
      .join('\n\n');
    if (text) return text;
  }

  if (Array.isArray(value.output)) {
    const chunks = [];
    for (const item of value.output) {
      if (typeof item?.text === 'string') chunks.push(item.text);
      if (Array.isArray(item?.content)) {
        for (const block of item.content) {
          if (typeof block?.text === 'string') chunks.push(block.text);
        }
      }
    }
    if (chunks.length) return chunks.join('\n\n');
  }

  const choice = value.choices?.[0];
  if (typeof choice?.message?.content === 'string') return choice.message.content;
  return '';
}
