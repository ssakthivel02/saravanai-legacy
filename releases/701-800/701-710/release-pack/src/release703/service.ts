import type { SafetyEvaluationAndHarmTaxonomy } from "./contracts";
import { validateSafetyEvaluationAndHarmTaxonomy } from "./contracts";
import { evaluateSafetyEvaluationAndHarmTaxonomy } from "./policy";

export function assessRelease703(value: SafetyEvaluationAndHarmTaxonomy) {
  const validationErrors = validateSafetyEvaluationAndHarmTaxonomy(value);
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
    decision: evaluateSafetyEvaluationAndHarmTaxonomy(value)
  };
}
