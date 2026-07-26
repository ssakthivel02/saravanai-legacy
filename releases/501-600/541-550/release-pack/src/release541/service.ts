import type { IdentityProofingAndAssurance } from "./contracts";
import { validateIdentityProofingAndAssurance } from "./contracts";
import { evaluateIdentityProofingAndAssurance } from "./policy";

export function assessRelease541(value: IdentityProofingAndAssurance) {
  const validationErrors = validateIdentityProofingAndAssurance(value);
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
    decision: evaluateIdentityProofingAndAssurance(value)
  };
}
