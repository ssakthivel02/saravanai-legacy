import type { IndependentAssuranceReadinessV2 } from "./contracts";
import { validateIndependentAssuranceReadinessV2 } from "./contracts";
import { evaluateIndependentAssuranceReadinessV2 } from "./policy";

export function assessRelease689(value: IndependentAssuranceReadinessV2) {
  const validationErrors = validateIndependentAssuranceReadinessV2(value);
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
    decision: evaluateIndependentAssuranceReadinessV2(value)
  };
}
