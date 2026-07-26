import type { BusinessAutomationAssuranceGate } from "./contracts";
import { validateBusinessAutomationAssuranceGate } from "./contracts";
import { evaluateBusinessAutomationAssuranceGate } from "./policy";

export function assessRelease680(value: BusinessAutomationAssuranceGate) {
  const validationErrors = validateBusinessAutomationAssuranceGate(value);
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
    decision: evaluateBusinessAutomationAssuranceGate(value)
  };
}
