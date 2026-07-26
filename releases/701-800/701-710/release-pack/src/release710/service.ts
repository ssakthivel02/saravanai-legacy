import type { AIEvaluationAndRedTeamAssuranceGate } from "./contracts";
import { validateAIEvaluationAndRedTeamAssuranceGate } from "./contracts";
import { evaluateAIEvaluationAndRedTeamAssuranceGate } from "./policy";

export function assessRelease710(value: AIEvaluationAndRedTeamAssuranceGate) {
  const validationErrors = validateAIEvaluationAndRedTeamAssuranceGate(value);
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
    decision: evaluateAIEvaluationAndRedTeamAssuranceGate(value)
  };
}
