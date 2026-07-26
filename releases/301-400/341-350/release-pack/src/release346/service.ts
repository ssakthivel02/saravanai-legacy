import type { SecureMultiPartyComputationReadiness } from "./contracts";
import { validateSecureMultiPartyComputationReadiness } from "./contracts";
import { evaluateSecureMultiPartyComputationReadiness } from "./policy";

export function assessRelease346(value: SecureMultiPartyComputationReadiness) {
  const validationErrors = validateSecureMultiPartyComputationReadiness(value);
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
    decision: evaluateSecureMultiPartyComputationReadiness(value)
  };
}
