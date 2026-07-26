import type { CulturalReligiousAndSensitiveContextReview } from "./contracts";
import { validateCulturalReligiousAndSensitiveContextReview } from "./contracts";
import { evaluateCulturalReligiousAndSensitiveContextReview } from "./policy";

export function assessRelease868(value: CulturalReligiousAndSensitiveContextReview) {
  const validationErrors = validateCulturalReligiousAndSensitiveContextReview(value);
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
    decision: evaluateCulturalReligiousAndSensitiveContextReview(value)
  };
}
