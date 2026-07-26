import type { ComplianceAndAssuranceGate } from "./contracts";
import { validateComplianceAndAssuranceGate } from "./contracts";
import { evaluateComplianceAndAssuranceGate } from "./policy";

export function assessRelease690(value: ComplianceAndAssuranceGate) {
  const validationErrors = validateComplianceAndAssuranceGate(value);
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
    decision: evaluateComplianceAndAssuranceGate(value)
  };
}
