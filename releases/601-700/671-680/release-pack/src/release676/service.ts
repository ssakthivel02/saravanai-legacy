import type { WorkflowIntegrationAndConnectorSafety } from "./contracts";
import { validateWorkflowIntegrationAndConnectorSafety } from "./contracts";
import { evaluateWorkflowIntegrationAndConnectorSafety } from "./policy";

export function assessRelease676(value: WorkflowIntegrationAndConnectorSafety) {
  const validationErrors = validateWorkflowIntegrationAndConnectorSafety(value);
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
    decision: evaluateWorkflowIntegrationAndConnectorSafety(value)
  };
}
