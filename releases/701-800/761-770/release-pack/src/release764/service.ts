import type { ServerAndWorkloadModernisationAssessment } from "./contracts";
import { validateServerAndWorkloadModernisationAssessment } from "./contracts";
import { evaluateServerAndWorkloadModernisationAssessment } from "./policy";

export function assessRelease764(value: ServerAndWorkloadModernisationAssessment) {
  const validationErrors = validateServerAndWorkloadModernisationAssessment(value);
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
    decision: evaluateServerAndWorkloadModernisationAssessment(value)
  };
}
