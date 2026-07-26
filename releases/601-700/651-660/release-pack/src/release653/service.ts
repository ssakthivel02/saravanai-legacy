import type { EphemeralCodeExecutionSandbox } from "./contracts";
import { validateEphemeralCodeExecutionSandbox } from "./contracts";
import { evaluateEphemeralCodeExecutionSandbox } from "./policy";

export function assessRelease653(value: EphemeralCodeExecutionSandbox) {
  const validationErrors = validateEphemeralCodeExecutionSandbox(value);
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
    decision: evaluateEphemeralCodeExecutionSandbox(value)
  };
}
