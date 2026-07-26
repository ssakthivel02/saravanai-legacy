import type { ProductionReadinessReviewV4 } from "./contracts";
import { validateProductionReadinessReviewV4 } from "./contracts";
import { evaluateProductionReadinessReviewV4 } from "./policy";

export function assessRelease492(value: ProductionReadinessReviewV4) {
  const validationErrors = validateProductionReadinessReviewV4(value);
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
    decision: evaluateProductionReadinessReviewV4(value)
  };
}
