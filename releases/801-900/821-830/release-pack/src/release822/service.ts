import type { AgentPlanCompilerAndStaticValidator } from "./contracts";
import { validateAgentPlanCompilerAndStaticValidator } from "./contracts";
import { evaluateAgentPlanCompilerAndStaticValidator } from "./policy";

export function assessRelease822(value: AgentPlanCompilerAndStaticValidator) {
  const validationErrors = validateAgentPlanCompilerAndStaticValidator(value);
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
    decision: evaluateAgentPlanCompilerAndStaticValidator(value)
  };
}
