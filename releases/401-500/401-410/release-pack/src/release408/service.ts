import type { AIQualityIncidentManagement } from "./contracts";
import { validateAIQualityIncidentManagement } from "./contracts";
import { evaluateAIQualityIncidentManagement } from "./policy";

export function assessRelease408(value: AIQualityIncidentManagement) {
  const validationErrors = validateAIQualityIncidentManagement(value);
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
    decision: evaluateAIQualityIncidentManagement(value)
  };
}
