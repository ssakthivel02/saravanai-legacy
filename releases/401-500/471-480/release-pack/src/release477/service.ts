import type { SecureCodingAssistantGovernance } from "./contracts";
import { validateSecureCodingAssistantGovernance } from "./contracts";
import { evaluateSecureCodingAssistantGovernance } from "./policy";

export function assessRelease477(value: SecureCodingAssistantGovernance) {
  const validationErrors = validateSecureCodingAssistantGovernance(value);
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
    decision: evaluateSecureCodingAssistantGovernance(value)
  };
}
