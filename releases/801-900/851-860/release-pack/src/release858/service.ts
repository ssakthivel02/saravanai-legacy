import type { CustomerSecurityQuestionnaireComposer } from "./contracts";
import { validateCustomerSecurityQuestionnaireComposer } from "./contracts";
import { evaluateCustomerSecurityQuestionnaireComposer } from "./policy";

export function assessRelease858(value: CustomerSecurityQuestionnaireComposer) {
  const validationErrors = validateCustomerSecurityQuestionnaireComposer(value);
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
    decision: evaluateCustomerSecurityQuestionnaireComposer(value)
  };
}
