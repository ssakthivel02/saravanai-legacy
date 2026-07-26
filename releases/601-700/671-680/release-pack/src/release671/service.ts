import type { BusinessProcessAndWorkflowRegistry } from "./contracts";
import { validateBusinessProcessAndWorkflowRegistry } from "./contracts";
import { evaluateBusinessProcessAndWorkflowRegistry } from "./policy";

export function assessRelease671(value: BusinessProcessAndWorkflowRegistry) {
  const validationErrors = validateBusinessProcessAndWorkflowRegistry(value);
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
    decision: evaluateBusinessProcessAndWorkflowRegistry(value)
  };
}
