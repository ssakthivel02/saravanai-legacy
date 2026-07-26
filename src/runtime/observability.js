import { booleanEnv } from './shared.js';

export function runtimeObservabilitySnapshot(env = {}) {
  const enabled = booleanEnv(env.RUNTIME_WAVE1_ENABLED);
  return {
    implementation: 'runtime-wave-1',
    state: enabled ? 'pilot-enabled' : 'disabled-by-default',
    controls: {
      privateOwnerOnly: true,
      publicRegistration: false,
      tenantWritesEnabled: false,
      productionWritesEnabled: false,
      paidProvidersEnabled: booleanEnv(env.PREMIUM_PROVIDERS_ENABLED) &&
        String(env.PAID_PROVIDER_OWNER_APPROVAL || '') === 'I_ACKNOWLEDGE_CHARGES',
      unifiedBillingEnabled: false,
      promptContentLogging: false,
      killSwitchAvailable: true
    },
    bindings: {
      ai: Boolean(env.AI),
      assets: Boolean(env.ASSETS),
      d1: Boolean(env.SAKTHI_DB),
      rateLimit: Boolean(env.SAKTHI_CHAT_RATE_LIMIT),
      ownerEmailConfigured: Boolean(env.OWNER_EMAIL)
    },
    endpoints: [
      '/api/v1/runtime/status',
      '/api/v1/runtime/context',
      '/api/v1/runtime/policy/evaluate',
      '/api/v1/runtime/ai/envelope',
      '/api/v1/runtime/ai/output/check',
      '/api/v1/runtime/observability'
    ],
    sensitiveContentIncluded: false
  };
}
