import type { PostIncidentLearningAndActionTracking } from "./contracts";
import { validatePostIncidentLearningAndActionTracking } from "./contracts";
import { evaluatePostIncidentLearningAndActionTracking } from "./policy";

export function assessRelease669(value: PostIncidentLearningAndActionTracking) {
  const validationErrors = validatePostIncidentLearningAndActionTracking(value);
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
    decision: evaluatePostIncidentLearningAndActionTracking(value)
  };
}
