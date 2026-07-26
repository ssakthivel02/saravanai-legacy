import type { IdentityTrustAssuranceGate } from "./contracts";
import { validateIdentityTrustAssuranceGate } from "./contracts";
import { evaluateIdentityTrustAssuranceGate } from "./policy";

export function assessRelease550(value: IdentityTrustAssuranceGate) {
  const validationErrors = validateIdentityTrustAssuranceGate(value);
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
    decision: evaluateIdentityTrustAssuranceGate(value)
  };
}
