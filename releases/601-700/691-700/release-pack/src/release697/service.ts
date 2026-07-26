import type { CustomerAcceptanceAndPilotEvidence } from "./contracts";
import { validateCustomerAcceptanceAndPilotEvidence } from "./contracts";
import { evaluateCustomerAcceptanceAndPilotEvidence } from "./policy";

export function assessRelease697(value: CustomerAcceptanceAndPilotEvidence) {
  const validationErrors = validateCustomerAcceptanceAndPilotEvidence(value);
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
    decision: evaluateCustomerAcceptanceAndPilotEvidence(value)
  };
}
