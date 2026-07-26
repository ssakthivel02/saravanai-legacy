import type { CRMAndCustomerDataIntegration } from "./contracts";
import { validateCRMAndCustomerDataIntegration } from "./contracts";
import { evaluateCRMAndCustomerDataIntegration } from "./policy";

export function assessRelease444(value: CRMAndCustomerDataIntegration) {
  const validationErrors = validateCRMAndCustomerDataIntegration(value);
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
    decision: evaluateCRMAndCustomerDataIntegration(value)
  };
}
