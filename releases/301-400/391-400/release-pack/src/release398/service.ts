import type { IndependentAssuranceAndCertificationReadiness } from "./contracts";
import { validateIndependentAssuranceAndCertificationReadiness } from "./contracts";
import { evaluateIndependentAssuranceAndCertificationReadiness } from "./policy";

export function assessRelease398(value: IndependentAssuranceAndCertificationReadiness) {
  const validationErrors = validateIndependentAssuranceAndCertificationReadiness(value);
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
    decision: evaluateIndependentAssuranceAndCertificationReadiness(value)
  };
}
