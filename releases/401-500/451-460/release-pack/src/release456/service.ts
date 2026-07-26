import type { CaseComplaintAndEscalationOperations } from "./contracts";
import { validateCaseComplaintAndEscalationOperations } from "./contracts";
import { evaluateCaseComplaintAndEscalationOperations } from "./policy";

export function assessRelease456(value: CaseComplaintAndEscalationOperations) {
  const validationErrors = validateCaseComplaintAndEscalationOperations(value);
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
    decision: evaluateCaseComplaintAndEscalationOperations(value)
  };
}
