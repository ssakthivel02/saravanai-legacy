import type { OperationalSupportAndServiceTransitionV5 } from "./contracts";
import { validateOperationalSupportAndServiceTransitionV5 } from "./contracts";
import { evaluateOperationalSupportAndServiceTransitionV5 } from "./policy";

export function assessRelease795(value: OperationalSupportAndServiceTransitionV5) {
  const validationErrors = validateOperationalSupportAndServiceTransitionV5(value);
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
    decision: evaluateOperationalSupportAndServiceTransitionV5(value)
  };
}
