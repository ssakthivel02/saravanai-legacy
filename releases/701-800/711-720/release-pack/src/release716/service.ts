import type { FactVerificationAndTemporalValidation } from "./contracts";
import { validateFactVerificationAndTemporalValidation } from "./contracts";
import { evaluateFactVerificationAndTemporalValidation } from "./policy";

export function assessRelease716(value: FactVerificationAndTemporalValidation) {
  const validationErrors = validateFactVerificationAndTemporalValidation(value);
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
    decision: evaluateFactVerificationAndTemporalValidation(value)
  };
}
