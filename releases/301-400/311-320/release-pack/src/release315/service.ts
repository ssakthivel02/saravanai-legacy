import type { MultiAgentCoordinationAndDeadlockControl } from "./contracts";
import { validateMultiAgentCoordinationAndDeadlockControl } from "./contracts";
import { evaluateMultiAgentCoordinationAndDeadlockControl } from "./policy";

export function assessRelease315(value: MultiAgentCoordinationAndDeadlockControl) {
  const validationErrors = validateMultiAgentCoordinationAndDeadlockControl(value);
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
    decision: evaluateMultiAgentCoordinationAndDeadlockControl(value)
  };
}
