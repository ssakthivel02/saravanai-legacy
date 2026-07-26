import type { AgentPlanningAndGoalGovernance } from "./contracts";
import { validateAgentPlanningAndGoalGovernance } from "./contracts";
import { evaluateAgentPlanningAndGoalGovernance } from "./policy";

export function assessRelease312(value: AgentPlanningAndGoalGovernance) {
  const validationErrors = validateAgentPlanningAndGoalGovernance(value);
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
    decision: evaluateAgentPlanningAndGoalGovernance(value)
  };
}
