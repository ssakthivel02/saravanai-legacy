import type { CustomerNotificationAndCommunicationSafety } from "./contracts";
import { validateCustomerNotificationAndCommunicationSafety } from "./contracts";
import { evaluateCustomerNotificationAndCommunicationSafety } from "./policy";

export function assessRelease454(value: CustomerNotificationAndCommunicationSafety) {
  const validationErrors = validateCustomerNotificationAndCommunicationSafety(value);
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
    decision: evaluateCustomerNotificationAndCommunicationSafety(value)
  };
}
