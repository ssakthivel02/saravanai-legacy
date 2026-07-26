import type { ResearchQualityAndBiasReview } from "./contracts";
import { validateResearchQualityAndBiasReview } from "./contracts";
import { evaluateResearchQualityAndBiasReview } from "./policy";

export function assessRelease717(value: ResearchQualityAndBiasReview) {
  const validationErrors = validateResearchQualityAndBiasReview(value);
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
    decision: evaluateResearchQualityAndBiasReview(value)
  };
}
