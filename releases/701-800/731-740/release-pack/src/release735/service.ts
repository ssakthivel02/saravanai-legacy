import type { CustomerRequestAndCaseIntake } from "./contracts";
import { validateCustomerRequestAndCaseIntake } from "./contracts";
import { evaluateCustomerRequestAndCaseIntake } from "./policy";

export function assessRelease735(value: CustomerRequestAndCaseIntake) {
  const validationErrors = validateCustomerRequestAndCaseIntake(value);
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
    decision: evaluateCustomerRequestAndCaseIntake(value)
  };
}
