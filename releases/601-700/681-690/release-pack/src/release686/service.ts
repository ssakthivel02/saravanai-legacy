import type { PolicyExceptionAndRiskAcceptanceV2 } from "./contracts";
import { validatePolicyExceptionAndRiskAcceptanceV2 } from "./contracts";
import { evaluatePolicyExceptionAndRiskAcceptanceV2 } from "./policy";

export function assessRelease686(value: PolicyExceptionAndRiskAcceptanceV2) {
  const validationErrors = validatePolicyExceptionAndRiskAcceptanceV2(value);
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
    decision: evaluatePolicyExceptionAndRiskAcceptanceV2(value)
  };
}
