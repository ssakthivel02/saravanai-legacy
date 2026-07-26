import type { WorkplaceOperationsAssuranceGate } from "./contracts";
import { validateWorkplaceOperationsAssuranceGate } from "./contracts";
import { evaluateWorkplaceOperationsAssuranceGate } from "./policy";

export function assessRelease560(value: WorkplaceOperationsAssuranceGate) {
  const validationErrors = validateWorkplaceOperationsAssuranceGate(value);
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
    decision: evaluateWorkplaceOperationsAssuranceGate(value)
  };
}
