import type { EdgeAIPrivacyAndSensorMinimisation } from "./contracts";
import { validateEdgeAIPrivacyAndSensorMinimisation } from "./contracts";
import { evaluateEdgeAIPrivacyAndSensorMinimisation } from "./policy";

export function assessRelease418(value: EdgeAIPrivacyAndSensorMinimisation) {
  const validationErrors = validateEdgeAIPrivacyAndSensorMinimisation(value);
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
    decision: evaluateEdgeAIPrivacyAndSensorMinimisation(value)
  };
}
