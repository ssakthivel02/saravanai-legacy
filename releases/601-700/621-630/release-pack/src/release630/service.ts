import type { EnterpriseRetrievalAssuranceGate } from "./contracts";
import { validateEnterpriseRetrievalAssuranceGate } from "./contracts";
import { evaluateEnterpriseRetrievalAssuranceGate } from "./policy";

export function assessRelease630(value: EnterpriseRetrievalAssuranceGate) {
  const validationErrors = validateEnterpriseRetrievalAssuranceGate(value);
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
    decision: evaluateEnterpriseRetrievalAssuranceGate(value)
  };
}
