import type { IdentityRecoveryAndBreakGlassOperations } from "./contracts";
import { validateIdentityRecoveryAndBreakGlassOperations } from "./contracts";
import { evaluateIdentityRecoveryAndBreakGlassOperations } from "./policy";

export function assessRelease534(value: IdentityRecoveryAndBreakGlassOperations) {
  const validationErrors = validateIdentityRecoveryAndBreakGlassOperations(value);
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
    decision: evaluateIdentityRecoveryAndBreakGlassOperations(value)
  };
}
