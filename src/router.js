export const RELEASE = '0.11.0-owner-security';
export const DEFAULT_GATEWAY = 'default';

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
    costClass: 'blocked',
    webSearch: false
  }
};

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
  return ['openai', 'anthropic', 'gemini', 'kimi'].includes(provider);
}

export function isProviderBlocked(provider) {
  return provider === 'kimi';
}

export function premiumEnabled(env = {}) {
  const featureFlag = String(env.PREMIUM_PROVIDERS_ENABLED || '').toLowerCase() === 'true';
  const ownerApproval = String(env.PAID_PROVIDER_OWNER_APPROVAL || '') === 'I_ACKNOWLEDGE_CHARGES';
  return featureFlag && ownerApproval;
}

export function selectRoute({ prompt = '', mode = 'automatic', provider = 'auto', budget = 'balanced' } = {}) {
  const safeMode = normaliseMode(mode);
  const safeProvider = normaliseProvider(provider);
  const fresh = safeMode === 'research' || requiresFreshResearch(prompt);

  if (fresh) {
    return {
      kind: 'research',
      provider: 'free-research',
      preferredPremiumProvider: safeProvider === 'openai' ? 'openai' : 'anthropic',
      reason: safeMode === 'research' ? 'research-mode' : 'freshness-required',
      freshnessRequired: true,
      budgetClass: 'free-research'
    };
  }

  if (safeProvider !== 'auto' && safeProvider !== 'free-research') {
    return {
      kind: 'chat',
      provider: safeProvider,
      reason: 'user-override',
      freshnessRequired: false,
      budgetClass: safeProvider === 'workers-ai' ? 'economy' : 'premium'
    };
  }

  if (budget === 'economy') {
    return { kind: 'chat', provider: 'workers-ai', reason: 'economy-budget', freshnessRequired: false, budgetClass: 'economy' };
  }

  if (safeMode === 'coding' && budget === 'premium') {
    return { kind: 'chat', provider: 'openai', reason: 'premium-coding', freshnessRequired: false, budgetClass: 'premium' };
  }

  if ((safeMode === 'document' || safeMode === 'website') && budget === 'premium') {
    return { kind: 'chat', provider: 'gemini', reason: 'premium-long-form', freshnessRequired: false, budgetClass: 'premium' };
  }

  return { kind: 'chat', provider: 'workers-ai', reason: 'cost-first-default', freshnessRequired: false, budgetClass: 'economy' };
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
  const allowPremium = premiumEnabled(env);
  return [
    {
      id: 'auto',
      name: 'Automatic free-first routing',
      configured: hasAi,
      selectable: hasAi,
      live: hasAi,
      health: hasAi ? 'ready' : 'missing-binding',
      costClass: 'free-first'
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
      const blocked = isProviderBlocked(entry.provider);
      const premium = isPremiumProvider(entry.provider);
      const selectable = hasAi && !blocked && (!premium || allowPremium);
      return {
        id: entry.provider,
        name: entry.label,
        model: resolveModel(entry.provider, env).model,
        configured: selectable,
        selectable,
        live: selectable && !premium,
        health: !hasAi
          ? 'missing-binding'
          : blocked
            ? 'disabled-owner-policy'
            : premium && !allowPremium
              ? 'disabled-cost-control'
              : premium
                ? 'gateway-on-demand'
                : 'ready',
        costClass: entry.costClass,
        webSearch: entry.webSearch,
        optionalPaid: premium,
        blockedByOwnerPolicy: blocked
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
