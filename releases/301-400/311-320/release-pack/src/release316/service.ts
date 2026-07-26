import type { FormalInvariantAndConstraintVerification } from "./contracts";
import { validateFormalInvariantAndConstraintVerification } from "./contracts";
import { evaluateFormalInvariantAndConstraintVerification } from "./policy";

export function assessRelease316(value: FormalInvariantAndConstraintVerification) {
  const validationErrors = validateFormalInvariantAndConstraintVerification(value);
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
    decision: evaluateFormalInvariantAndConstraintVerification(value)
  };
}
