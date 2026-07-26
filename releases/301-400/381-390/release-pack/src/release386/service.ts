import type { CulturalReligiousAndIndigenousKnowledgeReview } from "./contracts";
import { validateCulturalReligiousAndIndigenousKnowledgeReview } from "./contracts";
import { evaluateCulturalReligiousAndIndigenousKnowledgeReview } from "./policy";

export function assessRelease386(value: CulturalReligiousAndIndigenousKnowledgeReview) {
  const validationErrors = validateCulturalReligiousAndIndigenousKnowledgeReview(value);
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
    decision: evaluateCulturalReligiousAndIndigenousKnowledgeReview(value)
  };
}
