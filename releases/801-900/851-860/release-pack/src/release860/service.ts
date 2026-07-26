import type { TrustCentreOperationsActivationGate } from "./contracts";
import { validateTrustCentreOperationsActivationGate } from "./contracts";
import { evaluateTrustCentreOperationsActivationGate } from "./policy";

export function assessRelease860(value: TrustCentreOperationsActivationGate) {
  const validationErrors = validateTrustCentreOperationsActivationGate(value);
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
    decision: evaluateTrustCentreOperationsActivationGate(value)
  };
}
