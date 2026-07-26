import type { SecurityOperationsAssuranceGate } from "./contracts";
import { validateSecurityOperationsAssuranceGate } from "./contracts";
import { evaluateSecurityOperationsAssuranceGate } from "./policy";

export function assessRelease430(value: SecurityOperationsAssuranceGate) {
  const validationErrors = validateSecurityOperationsAssuranceGate(value);
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
    decision: evaluateSecurityOperationsAssuranceGate(value)
  };
}
