import type { HumanExpertReviewWorkflow } from "./contracts";
import { validateHumanExpertReviewWorkflow } from "./contracts";
import { evaluateHumanExpertReviewWorkflow } from "./policy";

export function assessRelease506(value: HumanExpertReviewWorkflow) {
  const validationErrors = validateHumanExpertReviewWorkflow(value);
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
    decision: evaluateHumanExpertReviewWorkflow(value)
  };
}
