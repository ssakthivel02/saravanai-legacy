import type { DataSubjectRightsOrchestrationV2 } from "./contracts";
import { validateDataSubjectRightsOrchestrationV2 } from "./contracts";
import { evaluateDataSubjectRightsOrchestrationV2 } from "./policy";

export function assessRelease636(value: DataSubjectRightsOrchestrationV2) {
  const validationErrors = validateDataSubjectRightsOrchestrationV2(value);
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
    decision: evaluateDataSubjectRightsOrchestrationV2(value)
  };
}
