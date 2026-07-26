import type { EdgeModelPackagingAndVerification } from "./contracts";
import { validateEdgeModelPackagingAndVerification } from "./contracts";
import { evaluateEdgeModelPackagingAndVerification } from "./policy";

export function assessRelease413(value: EdgeModelPackagingAndVerification) {
  const validationErrors = validateEdgeModelPackagingAndVerification(value);
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
    decision: evaluateEdgeModelPackagingAndVerification(value)
  };
}
