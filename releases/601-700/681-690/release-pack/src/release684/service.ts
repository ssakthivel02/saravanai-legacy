import type { ControlEffectivenessAssessment } from "./contracts";
import { validateControlEffectivenessAssessment } from "./contracts";
import { evaluateControlEffectivenessAssessment } from "./policy";

export function assessRelease684(value: ControlEffectivenessAssessment) {
  const validationErrors = validateControlEffectivenessAssessment(value);
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
    decision: evaluateControlEffectivenessAssessment(value)
  };
}
