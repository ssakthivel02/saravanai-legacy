import type { TaskDelegationAndApprovalOperations } from "./contracts";
import { validateTaskDelegationAndApprovalOperations } from "./contracts";
import { evaluateTaskDelegationAndApprovalOperations } from "./policy";

export function assessRelease556(value: TaskDelegationAndApprovalOperations) {
  const validationErrors = validateTaskDelegationAndApprovalOperations(value);
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
    decision: evaluateTaskDelegationAndApprovalOperations(value)
  };
}
