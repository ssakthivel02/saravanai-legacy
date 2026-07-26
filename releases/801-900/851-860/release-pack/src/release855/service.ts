import type { ControlTestingAndExceptionRuntime } from "./contracts";
import { validateControlTestingAndExceptionRuntime } from "./contracts";
import { evaluateControlTestingAndExceptionRuntime } from "./policy";

export function assessRelease855(value: ControlTestingAndExceptionRuntime) {
  const validationErrors = validateControlTestingAndExceptionRuntime(value);
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
    decision: evaluateControlTestingAndExceptionRuntime(value)
  };
}
