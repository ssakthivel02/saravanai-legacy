import type { OperationalResilienceCommandView } from "./contracts";
import { validateOperationalResilienceCommandView } from "./contracts";
import { evaluateOperationalResilienceCommandView } from "./policy";

export function assessRelease786(value: OperationalResilienceCommandView) {
  const validationErrors = validateOperationalResilienceCommandView(value);
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
    decision: evaluateOperationalResilienceCommandView(value)
  };
}
