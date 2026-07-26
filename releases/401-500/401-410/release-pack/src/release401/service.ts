import type { EnterpriseAICapabilityRegistry } from "./contracts";
import { validateEnterpriseAICapabilityRegistry } from "./contracts";
import { evaluateEnterpriseAICapabilityRegistry } from "./policy";

export function assessRelease401(value: EnterpriseAICapabilityRegistry) {
  const validationErrors = validateEnterpriseAICapabilityRegistry(value);
  if (validationErrors.length) {
    return {
      valid: false,
      validationErrors,
      decision: { allowed: false, reason: "validation_failed", obligations: ["correct_input"] }
    };
  }
  return {
    valid: true,
    validationErrors: [],
    decision: evaluateEnterpriseAICapabilityRegistry(value)
  };
}
