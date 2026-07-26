import type { AgentBehaviourAndDriftMonitoring } from "./contracts";
import { validateAgentBehaviourAndDriftMonitoring } from "./contracts";
import { evaluateAgentBehaviourAndDriftMonitoring } from "./policy";

export function assessRelease619(value: AgentBehaviourAndDriftMonitoring) {
  const validationErrors = validateAgentBehaviourAndDriftMonitoring(value);
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
    decision: evaluateAgentBehaviourAndDriftMonitoring(value)
  };
}
