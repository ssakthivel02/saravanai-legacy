import type { TaskReviewAndApprovalBoard } from "./contracts";
import { validateTaskReviewAndApprovalBoard } from "./contracts";
import { evaluateTaskReviewAndApprovalBoard } from "./policy";

export function assessRelease845(value: TaskReviewAndApprovalBoard) {
  const validationErrors = validateTaskReviewAndApprovalBoard(value);
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
    decision: evaluateTaskReviewAndApprovalBoard(value)
  };
}
