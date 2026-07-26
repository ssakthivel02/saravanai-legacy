import type { RBACAndABACDecisionEngineV2 } from "./contracts";
import { validateRBACAndABACDecisionEngineV2 } from "./contracts";
import { evaluateRBACAndABACDecisionEngineV2 } from "./policy";

export function assessRelease804(value: RBACAndABACDecisionEngineV2) {
  const validationErrors = validateRBACAndABACDecisionEngineV2(value);
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
    decision: evaluateRBACAndABACDecisionEngineV2(value)
  };
}
