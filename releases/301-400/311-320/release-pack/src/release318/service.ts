import type { AgentBehaviourDriftMonitoring } from "./contracts";
import { validateAgentBehaviourDriftMonitoring } from "./contracts";
import { evaluateAgentBehaviourDriftMonitoring } from "./policy";

export function assessRelease318(value: AgentBehaviourDriftMonitoring) {
  const validationErrors = validateAgentBehaviourDriftMonitoring(value);
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
    decision: evaluateAgentBehaviourDriftMonitoring(value)
  };
}
