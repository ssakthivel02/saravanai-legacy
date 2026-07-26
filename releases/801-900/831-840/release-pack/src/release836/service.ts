import type { TemporalFactVerificationRuntime } from "./contracts";
import { validateTemporalFactVerificationRuntime } from "./contracts";
import { evaluateTemporalFactVerificationRuntime } from "./policy";

export function assessRelease836(value: TemporalFactVerificationRuntime) {
  const validationErrors = validateTemporalFactVerificationRuntime(value);
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
    decision: evaluateTemporalFactVerificationRuntime(value)
  };
}
