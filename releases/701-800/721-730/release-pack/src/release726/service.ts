import type { ContentManagementAndPublishingWorkflow } from "./contracts";
import { validateContentManagementAndPublishingWorkflow } from "./contracts";
import { evaluateContentManagementAndPublishingWorkflow } from "./policy";

export function assessRelease726(value: ContentManagementAndPublishingWorkflow) {
  const validationErrors = validateContentManagementAndPublishingWorkflow(value);
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
    decision: evaluateContentManagementAndPublishingWorkflow(value)
  };
}
