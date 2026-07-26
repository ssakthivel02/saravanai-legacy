import type { AgentFailureRecoveryAndCompensation } from "./contracts";
import { validateAgentFailureRecoveryAndCompensation } from "./contracts";
import { evaluateAgentFailureRecoveryAndCompensation } from "./policy";

export function assessRelease618(value: AgentFailureRecoveryAndCompensation) {
  const validationErrors = validateAgentFailureRecoveryAndCompensation(value);
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
    decision: evaluateAgentFailureRecoveryAndCompensation(value)
  };
}
