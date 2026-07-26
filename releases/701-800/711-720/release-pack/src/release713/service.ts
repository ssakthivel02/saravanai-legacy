import type { PrimarySourceAcquisitionAndPreservation } from "./contracts";
import { validatePrimarySourceAcquisitionAndPreservation } from "./contracts";
import { evaluatePrimarySourceAcquisitionAndPreservation } from "./policy";

export function assessRelease713(value: PrimarySourceAcquisitionAndPreservation) {
  const validationErrors = validatePrimarySourceAcquisitionAndPreservation(value);
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
    decision: evaluatePrimarySourceAcquisitionAndPreservation(value)
  };
}
