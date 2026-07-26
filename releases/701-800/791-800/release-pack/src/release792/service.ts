import type { ProductionArchitectureReviewV7 } from "./contracts";
import { validateProductionArchitectureReviewV7 } from "./contracts";
import { evaluateProductionArchitectureReviewV7 } from "./policy";

export function assessRelease792(value: ProductionArchitectureReviewV7) {
  const validationErrors = validateProductionArchitectureReviewV7(value);
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
    decision: evaluateProductionArchitectureReviewV7(value)
  };
}
