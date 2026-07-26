import type { IdentityRecoveryFraudAndRedress } from "./contracts";
import { validateIdentityRecoveryFraudAndRedress } from "./contracts";
import { evaluateIdentityRecoveryFraudAndRedress } from "./policy";

export function assessRelease547(value: IdentityRecoveryFraudAndRedress) {
  const validationErrors = validateIdentityRecoveryFraudAndRedress(value);
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
    decision: evaluateIdentityRecoveryFraudAndRedress(value)
  };
}
