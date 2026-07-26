import type { SecureAgentRuntimeAssuranceGate } from "./contracts";
import { validateSecureAgentRuntimeAssuranceGate } from "./contracts";
import { evaluateSecureAgentRuntimeAssuranceGate } from "./policy";

export function assessRelease620(value: SecureAgentRuntimeAssuranceGate) {
  const validationErrors = validateSecureAgentRuntimeAssuranceGate(value);
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
    decision: evaluateSecureAgentRuntimeAssuranceGate(value)
  };
}
