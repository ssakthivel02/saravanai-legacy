import type { InferenceRequestAdmissionControl } from "./contracts";
import { validateInferenceRequestAdmissionControl } from "./contracts";
import { evaluateInferenceRequestAdmissionControl } from "./policy";

export function assessRelease604(value: InferenceRequestAdmissionControl) {
  const validationErrors = validateInferenceRequestAdmissionControl(value);
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
    decision: evaluateInferenceRequestAdmissionControl(value)
  };
}
