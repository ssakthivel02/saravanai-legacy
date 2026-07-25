const RELEASE = '0.2.0';
const EDGE_MODEL = '@cf/meta/llama-3.1-8b-instruct-fast';
const MAX_PROMPT_CHARS = 8000;

const modeInstructions = {
  automatic: 'Choose the clearest useful response format for the request.',
  research: 'Act as an evidence-first research specialist. Separate established facts, reasonable inference, and unresolved uncertainty. Never invent citations or claim live web research unless tools actually supplied sources.',
  document: 'Act as a professional document specialist. Produce well-structured, implementation-ready content with clear headings and concise language.',
  coding: 'Act as a senior software engineer. Provide secure, maintainable solutions, state assumptions, include validation and rollback considerations, and do not claim code was executed unless evidence is available.',
  website: 'Act as a product engineer and UX specialist. Prioritise accessibility, security, responsive behaviour, measurable acceptance criteria, and production-safe delivery.'
};

function json(data, status = 200, requestId = crypto.randomUUID()) {
  return Response.json({ ...data, requestId }, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'X-Request-ID': requestId
    }
  });
}

function providerStatus(env) {
  return [
    { id: 'auto', name: 'Automatic (cost-first)', configured: Boolean(env.AI), live: Boolean(env.AI) },
    { id: 'workers-ai', name: 'Sakthi Edge · Workers AI', configured: Boolean(env.AI), live: Boolean(env.AI), model: EDGE_MODEL },
    { id: 'openai', name: 'OpenAI', configured: Boolean(env.OPENAI_API_KEY && env.OPENAI_MODEL), live: false },
    { id: 'anthropic', name: 'Claude', configured: Boolean(env.ANTHROPIC_API_KEY && env.ANTHROPIC_MODEL), live: false },
    { id: 'gemini', name: 'Gemini', configured: Boolean(env.GEMINI_API_KEY && env.GEMINI_MODEL), live: false },
    { id: 'kimi', name: 'Kimi', configured: Boolean(env.KIMI_API_KEY && env.KIMI_MODEL && env.KIMI_BASE_URL), live: false }
  ];
}

function systemPrompt(mode) {
  const instruction = modeInstructions[mode] || modeInstructions.automatic;
  return [
    'You are SakthiAI, a trustworthy multilingual AI operating platform.',
    'Respond in the language used by the user, including Tamil or English.',
    'Be direct, precise and practical.',
    'Do not invent facts, citations, tool results, deployments, file changes or access that you do not have.',
    'For current information, clearly state that live research is required unless verified sources are provided.',
    instruction
  ].join(' ');
}

function normalisePrompt(value) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, MAX_PROMPT_CHARS);
}

async function handleChat(request, env) {
  const requestId = crypto.randomUUID();
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > 32768) return json({ error: 'Request is too large.', code: 'PAYLOAD_TOO_LARGE' }, 413, requestId);

  const origin = request.headers.get('origin');
  const requestOrigin = new URL(request.url).origin;
  if (origin && origin !== requestOrigin) {
    return json({ error: 'Cross-origin chat requests are not permitted.', code: 'ORIGIN_DENIED' }, 403, requestId);
  }

  if (env.SAKTHI_CHAT_RATE_LIMIT) {
    const clientIp = request.headers.get('cf-connecting-ip') || 'unknown';
    const result = await env.SAKTHI_CHAT_RATE_LIMIT.limit({ key: `chat:${clientIp}` });
    if (!result.success) {
      return json({ error: 'Rate limit reached. Please wait one minute and try again.', code: 'RATE_LIMITED' }, 429, requestId);
    }
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'A valid JSON body is required.', code: 'INVALID_JSON' }, 400, requestId);
  }

  const prompt = normalisePrompt(body.prompt);
  const mode = Object.hasOwn(modeInstructions, body.mode) ? body.mode : 'automatic';
  const provider = body.provider === 'workers-ai' ? 'workers-ai' : 'auto';

  if (!prompt) return json({ error: 'Please enter a task or question.', code: 'PROMPT_REQUIRED' }, 400, requestId);
  if (!env.AI) return json({ error: 'The AI runtime binding is not available.', code: 'AI_BINDING_MISSING' }, 503, requestId);

  const messages = [
    { role: 'system', content: systemPrompt(mode) },
    { role: 'user', content: prompt }
  ];

  try {
    const startedAt = Date.now();
    const result = await env.AI.run(EDGE_MODEL, {
      messages,
      max_tokens: 1200,
      temperature: mode === 'coding' ? 0.2 : 0.35
    });
    const answer = typeof result === 'string' ? result : result?.response;
    if (!answer) throw new Error('The model returned an empty response.');

    return json({
      status: 'ok',
      release: RELEASE,
      provider: provider === 'auto' ? 'workers-ai' : provider,
      model: EDGE_MODEL,
      mode,
      answer,
      latencyMs: Date.now() - startedAt,
      limitations: ['No live web search in Release 002', 'External premium providers are not enabled until their encrypted secrets and model policies are configured']
    }, 200, requestId);
  } catch (error) {
    console.error('SakthiAI inference failed', { requestId, message: error?.message });
    return json({ error: 'AI inference failed. Please retry shortly.', code: 'INFERENCE_FAILED' }, 502, requestId);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'GET' && (url.pathname === '/api/health' || url.pathname === '/api/v1/health')) {
      return json({ status: 'ok', service: 'sakthi-ai-nexus', environment: 'production', release: RELEASE, aiRuntime: Boolean(env.AI) });
    }

    if (request.method === 'GET' && url.pathname === '/api/v1/status') {
      return json({
        status: 'ok',
        service: 'sakthi-ai-nexus',
        release: RELEASE,
        publicBeta: true,
        aiRuntime: Boolean(env.AI),
        capabilities: ['chat', 'task modes', 'server-side inference', 'rate limiting', 'PWA'],
        providers: providerStatus(env)
      });
    }

    if (request.method === 'GET' && url.pathname === '/api/v1/models') {
      return json({ providers: providerStatus(env) });
    }

    if (request.method === 'POST' && url.pathname === '/api/v1/chat') {
      return handleChat(request, env);
    }

    if (url.pathname.startsWith('/api/')) {
      return json({ error: 'API route not found.', code: 'NOT_FOUND' }, 404);
    }

    return env.ASSETS.fetch(request);
  }
};
