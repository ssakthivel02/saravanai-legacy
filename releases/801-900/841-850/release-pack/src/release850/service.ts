import type { CustomerWorkspaceActivationGate } from "./contracts";
import { validateCustomerWorkspaceActivationGate } from "./contracts";
import { evaluateCustomerWorkspaceActivationGate } from "./policy";

export function assessRelease850(value: CustomerWorkspaceActivationGate) {
  const validationErrors = validateCustomerWorkspaceActivationGate(value);
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
    decision: evaluateCustomerWorkspaceActivationGate(value)
  };
}
