import type { RuntimeSafetyFilterOrchestration } from "./contracts";
import { validateRuntimeSafetyFilterOrchestration } from "./contracts";
import { evaluateRuntimeSafetyFilterOrchestration } from "./policy";

export function assessRelease606(value: RuntimeSafetyFilterOrchestration) {
  const validationErrors = validateRuntimeSafetyFilterOrchestration(value);
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
    decision: evaluateRuntimeSafetyFilterOrchestration(value)
  };
}
