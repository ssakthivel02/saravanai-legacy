import type { EvaluationEvidenceAndDecisionDashboard } from "./contracts";
import { validateEvaluationEvidenceAndDecisionDashboard } from "./contracts";
import { evaluateEvaluationEvidenceAndDecisionDashboard } from "./policy";

export function assessRelease709(value: EvaluationEvidenceAndDecisionDashboard) {
  const validationErrors = validateEvaluationEvidenceAndDecisionDashboard(value);
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
    decision: evaluateEvaluationEvidenceAndDecisionDashboard(value)
  };
}
