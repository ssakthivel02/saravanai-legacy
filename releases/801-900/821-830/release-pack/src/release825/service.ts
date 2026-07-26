import type { CheckpointAndDurableAgentState } from "./contracts";
import { validateCheckpointAndDurableAgentState } from "./contracts";
import { evaluateCheckpointAndDurableAgentState } from "./policy";

export function assessRelease825(value: CheckpointAndDurableAgentState) {
  const validationErrors = validateCheckpointAndDurableAgentState(value);
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
    decision: evaluateCheckpointAndDurableAgentState(value)
  };
}
