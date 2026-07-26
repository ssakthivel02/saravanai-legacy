import type { GlobalDigitalTrustAssuranceGate } from "./contracts";
import { validateGlobalDigitalTrustAssuranceGate } from "./contracts";
import { evaluateGlobalDigitalTrustAssuranceGate } from "./policy";

export function assessRelease490(value: GlobalDigitalTrustAssuranceGate) {
  const validationErrors = validateGlobalDigitalTrustAssuranceGate(value);
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
    decision: evaluateGlobalDigitalTrustAssuranceGate(value)
  };
}
