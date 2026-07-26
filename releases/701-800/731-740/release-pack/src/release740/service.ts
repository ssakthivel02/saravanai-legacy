import type { CommunicationsAndCustomerOperationsGate } from "./contracts";
import { validateCommunicationsAndCustomerOperationsGate } from "./contracts";
import { evaluateCommunicationsAndCustomerOperationsGate } from "./policy";

export function assessRelease740(value: CommunicationsAndCustomerOperationsGate) {
  const validationErrors = validateCommunicationsAndCustomerOperationsGate(value);
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
    decision: evaluateCommunicationsAndCustomerOperationsGate(value)
  };
}
