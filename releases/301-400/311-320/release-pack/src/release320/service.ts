import type { AgentEngineeringAssuranceGate } from "./contracts";
import { validateAgentEngineeringAssuranceGate } from "./contracts";
import { evaluateAgentEngineeringAssuranceGate } from "./policy";

export function assessRelease320(value: AgentEngineeringAssuranceGate) {
  const validationErrors = validateAgentEngineeringAssuranceGate(value);
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
    decision: evaluateAgentEngineeringAssuranceGate(value)
  };
}
