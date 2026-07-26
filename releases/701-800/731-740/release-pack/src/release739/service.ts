import type { CustomerCommunicationCorrectionAndWithdrawal } from "./contracts";
import { validateCustomerCommunicationCorrectionAndWithdrawal } from "./contracts";
import { evaluateCustomerCommunicationCorrectionAndWithdrawal } from "./policy";

export function assessRelease739(value: CustomerCommunicationCorrectionAndWithdrawal) {
  const validationErrors = validateCustomerCommunicationCorrectionAndWithdrawal(value);
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
    decision: evaluateCustomerCommunicationCorrectionAndWithdrawal(value)
  };
}
