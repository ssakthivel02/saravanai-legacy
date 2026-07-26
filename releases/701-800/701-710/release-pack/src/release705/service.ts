import type { HallucinationAndFactualityEvaluationV2 } from "./contracts";
import { validateHallucinationAndFactualityEvaluationV2 } from "./contracts";
import { evaluateHallucinationAndFactualityEvaluationV2 } from "./policy";

export function assessRelease705(value: HallucinationAndFactualityEvaluationV2) {
  const validationErrors = validateHallucinationAndFactualityEvaluationV2(value);
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
    decision: evaluateHallucinationAndFactualityEvaluationV2(value)
  };
}
