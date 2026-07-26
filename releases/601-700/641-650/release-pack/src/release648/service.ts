import type { MediaProvenancePackagingAndVerification } from "./contracts";
import { validateMediaProvenancePackagingAndVerification } from "./contracts";
import { evaluateMediaProvenancePackagingAndVerification } from "./policy";

export function assessRelease648(value: MediaProvenancePackagingAndVerification) {
  const validationErrors = validateMediaProvenancePackagingAndVerification(value);
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
    decision: evaluateMediaProvenancePackagingAndVerification(value)
  };
}
