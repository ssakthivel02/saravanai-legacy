import type { OperationalAcceptanceAndServiceTransitionV2 } from "./contracts";
import { validateOperationalAcceptanceAndServiceTransitionV2 } from "./contracts";
import { evaluateOperationalAcceptanceAndServiceTransitionV2 } from "./policy";

export function assessRelease493(value: OperationalAcceptanceAndServiceTransitionV2) {
  const validationErrors = validateOperationalAcceptanceAndServiceTransitionV2(value);
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
    decision: evaluateOperationalAcceptanceAndServiceTransitionV2(value)
  };
}
