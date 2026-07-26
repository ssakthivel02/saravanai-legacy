import type { WorkflowExceptionAndCaseManagement } from "./contracts";
import { validateWorkflowExceptionAndCaseManagement } from "./contracts";
import { evaluateWorkflowExceptionAndCaseManagement } from "./policy";

export function assessRelease678(value: WorkflowExceptionAndCaseManagement) {
  const validationErrors = validateWorkflowExceptionAndCaseManagement(value);
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
    decision: evaluateWorkflowExceptionAndCaseManagement(value)
  };
}
