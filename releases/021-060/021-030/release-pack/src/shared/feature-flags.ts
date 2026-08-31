export interface SafetyFlags {
  publicRegistrationEnabled: boolean;
  productionWritesEnabled: boolean;
  paidProvidersEnabled: boolean;
  autonomousToolExecutionEnabled: boolean;
}

export function safetyFlags(env: Record<string, string | undefined>): SafetyFlags {
  return {
    publicRegistrationEnabled: env.PUBLIC_REGISTRATION_ENABLED === "true",
    productionWritesEnabled: env.PRODUCTION_WRITES_ENABLED === "true",
    paidProvidersEnabled: env.PAID_PROVIDERS_ENABLED === "true",
    autonomousToolExecutionEnabled: env.AUTONOMOUS_TOOL_EXECUTION_ENABLED === "true"
  };
}
