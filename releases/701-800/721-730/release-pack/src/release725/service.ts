import type { FormWorkflowAndDataCaptureBuilder } from "./contracts";
import { validateFormWorkflowAndDataCaptureBuilder } from "./contracts";
import { evaluateFormWorkflowAndDataCaptureBuilder } from "./policy";

export function assessRelease725(value: FormWorkflowAndDataCaptureBuilder) {
  const validationErrors = validateFormWorkflowAndDataCaptureBuilder(value);
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
    decision: evaluateFormWorkflowAndDataCaptureBuilder(value)
  };
}
