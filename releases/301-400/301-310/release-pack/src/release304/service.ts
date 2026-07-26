import type { CustomerJourneyTwin } from "./contracts";
import { validateCustomerJourneyTwin } from "./contracts";
import { evaluateCustomerJourneyTwin } from "./policy";

export function assessRelease304(value: CustomerJourneyTwin) {
  const validationErrors = validateCustomerJourneyTwin(value);
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
    decision: evaluateCustomerJourneyTwin(value)
  };
}
