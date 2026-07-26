import type { AgentPlanValidationAndPolicyCompilation } from "./contracts";
import { validateAgentPlanValidationAndPolicyCompilation } from "./contracts";
import { evaluateAgentPlanValidationAndPolicyCompilation } from "./policy";

export function assessRelease612(value: AgentPlanValidationAndPolicyCompilation) {
  const validationErrors = validateAgentPlanValidationAndPolicyCompilation(value);
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
    decision: evaluateAgentPlanValidationAndPolicyCompilation(value)
  };
}
