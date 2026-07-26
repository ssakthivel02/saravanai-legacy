import type { IndependentAuditAndAttestationReadiness } from "./contracts";
import { validateIndependentAuditAndAttestationReadiness } from "./contracts";
import { evaluateIndependentAuditAndAttestationReadiness } from "./policy";

export function assessRelease489(value: IndependentAuditAndAttestationReadiness) {
  const validationErrors = validateIndependentAuditAndAttestationReadiness(value);
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
    decision: evaluateIndependentAuditAndAttestationReadiness(value)
  };
}
