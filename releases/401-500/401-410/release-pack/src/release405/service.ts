import type { AIEvaluationCampaignManagement } from "./contracts";
import { validateAIEvaluationCampaignManagement } from "./contracts";
import { evaluateAIEvaluationCampaignManagement } from "./policy";

export function assessRelease405(value: AIEvaluationCampaignManagement) {
  const validationErrors = validateAIEvaluationCampaignManagement(value);
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
    decision: evaluateAIEvaluationCampaignManagement(value)
  };
}
