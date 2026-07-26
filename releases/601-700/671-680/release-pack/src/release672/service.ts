import type { WorkflowDefinitionAndVersionControl } from "./contracts";
import { validateWorkflowDefinitionAndVersionControl } from "./contracts";
import { evaluateWorkflowDefinitionAndVersionControl } from "./policy";

export function assessRelease672(value: WorkflowDefinitionAndVersionControl) {
  const validationErrors = validateWorkflowDefinitionAndVersionControl(value);
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
    decision: evaluateWorkflowDefinitionAndVersionControl(value)
  };
}
