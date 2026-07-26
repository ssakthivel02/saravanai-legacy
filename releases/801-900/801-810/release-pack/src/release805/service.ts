import type { PrivilegedSessionAndStepUpControl } from "./contracts";
import { validatePrivilegedSessionAndStepUpControl } from "./contracts";
import { evaluatePrivilegedSessionAndStepUpControl } from "./policy";

export function assessRelease805(value: PrivilegedSessionAndStepUpControl) {
  const validationErrors = validatePrivilegedSessionAndStepUpControl(value);
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
    decision: evaluatePrivilegedSessionAndStepUpControl(value)
  };
}
