import type { CustomerExperienceReliabilityAndSLO } from "./contracts";
import { validateCustomerExperienceReliabilityAndSLO } from "./contracts";
import { evaluateCustomerExperienceReliabilityAndSLO } from "./policy";

export function assessRelease459(value: CustomerExperienceReliabilityAndSLO) {
  const validationErrors = validateCustomerExperienceReliabilityAndSLO(value);
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
    decision: evaluateCustomerExperienceReliabilityAndSLO(value)
  };
}
