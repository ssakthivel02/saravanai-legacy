import type { ComplaintAppealAndRedressOperations } from "./contracts";
import { validateComplaintAppealAndRedressOperations } from "./contracts";
import { evaluateComplaintAppealAndRedressOperations } from "./policy";

export function assessRelease737(value: ComplaintAppealAndRedressOperations) {
  const validationErrors = validateComplaintAppealAndRedressOperations(value);
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
    decision: evaluateComplaintAppealAndRedressOperations(value)
  };
}
