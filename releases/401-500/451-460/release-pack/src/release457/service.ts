import type { CustomerFeedbackAndResearchOperations } from "./contracts";
import { validateCustomerFeedbackAndResearchOperations } from "./contracts";
import { evaluateCustomerFeedbackAndResearchOperations } from "./policy";

export function assessRelease457(value: CustomerFeedbackAndResearchOperations) {
  const validationErrors = validateCustomerFeedbackAndResearchOperations(value);
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
    decision: evaluateCustomerFeedbackAndResearchOperations(value)
  };
}
