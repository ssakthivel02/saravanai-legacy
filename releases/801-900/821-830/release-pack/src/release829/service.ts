import type { AgentBehaviourEvaluationAndDriftResponse } from "./contracts";
import { validateAgentBehaviourEvaluationAndDriftResponse } from "./contracts";
import { evaluateAgentBehaviourEvaluationAndDriftResponse } from "./policy";

export function assessRelease829(value: AgentBehaviourEvaluationAndDriftResponse) {
  const validationErrors = validateAgentBehaviourEvaluationAndDriftResponse(value);
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
    decision: evaluateAgentBehaviourEvaluationAndDriftResponse(value)
  };
}
