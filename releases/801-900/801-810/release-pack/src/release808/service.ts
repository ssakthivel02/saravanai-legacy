import type { BreakGlassIdentityOperations } from "./contracts";
import { validateBreakGlassIdentityOperations } from "./contracts";
import { evaluateBreakGlassIdentityOperations } from "./policy";

export function assessRelease808(value: BreakGlassIdentityOperations) {
  const validationErrors = validateBreakGlassIdentityOperations(value);
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
    decision: evaluateBreakGlassIdentityOperations(value)
  };
}
