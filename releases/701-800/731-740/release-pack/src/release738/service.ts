import type { ServiceQualityAndConversationReview } from "./contracts";
import { validateServiceQualityAndConversationReview } from "./contracts";
import { evaluateServiceQualityAndConversationReview } from "./policy";

export function assessRelease738(value: ServiceQualityAndConversationReview) {
  const validationErrors = validateServiceQualityAndConversationReview(value);
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
    decision: evaluateServiceQualityAndConversationReview(value)
  };
}
