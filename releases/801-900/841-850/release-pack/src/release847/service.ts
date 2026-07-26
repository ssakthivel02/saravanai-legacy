import type { CustomerSupportCaseAndServiceRequest } from "./contracts";
import { validateCustomerSupportCaseAndServiceRequest } from "./contracts";
import { evaluateCustomerSupportCaseAndServiceRequest } from "./policy";

export function assessRelease847(value: CustomerSupportCaseAndServiceRequest) {
  const validationErrors = validateCustomerSupportCaseAndServiceRequest(value);
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
    decision: evaluateCustomerSupportCaseAndServiceRequest(value)
  };
}
