import { booleanEnv, normaliseText, sha256 } from './shared.js';

const MAX_PROMPT_CHARS = 12000;
const SECRET_PATTERNS = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/i,
  /\b(?:password|passwd|api[_ -]?key|secret|access[_ -]?token|refresh[_ -]?token|private[_ -]?key)\b\s*[:=]/i,
  /\bsk-[A-Za-z0-9_-]{20,}\b/,
  /\bAIza[A-Za-z0-9_-]{20,}\b/
];

export function containsRuntimeSecret(value = '') {
  return SECRET_PATTERNS.some((pattern) => pattern.test(value));
}

export async function createAiRequestEnvelope(body = {}, context, env = {}) {
  const prompt = normaliseText(body.prompt, MAX_PROMPT_CHARS);
  const mode = ['automatic', 'research', 'document', 'coding', 'website']
    .includes(body.mode)
    ? body.mode
    : 'automatic';
  const budget = ['economy', 'balanced'].includes(body.budget)
    ? body.budget
    : 'balanced';

  const errors = [];
  if (!prompt) errors.push('prompt_required');
  if (typeof body.prompt === 'string' && body.prompt.trim().length > MAX_PROMPT_CHARS) {
    errors.push('prompt_too_large');
  }
  if (containsRuntimeSecret(prompt)) errors.push('secret_detected');

  const premiumEnabled = booleanEnv(env.PREMIUM_PROVIDERS_ENABLED) &&
    String(env.PAID_PROVIDER_OWNER_APPROVAL || '') === 'I_ACKNOWLEDGE_CHARGES';

  const promptSha256 = prompt ? await sha256(prompt) : null;

  return {
    valid: errors.length === 0,
    errors,
    envelope: {
      requestId: context.requestId,
      traceId: context.traceId,
      tenantId: context.tenant.tenantId,
      actorType: 'private-owner',
      purpose: normaliseText(body.purpose, 160) || 'owner-request',
      promptSha256,
      promptLength: prompt.length,
      promptStored: false,
      mode,
      budget,
      provider: 'workers-ai',
      routingPolicy: 'free-first',
      premiumProvidersEnabled: premiumEnabled,
      paidProviderSelected: false,
      productionWriteAllowed: false,
      humanAccountable: true
    }
  };
}
