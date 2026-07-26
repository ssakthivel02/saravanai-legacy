import type { ProductionArchitectureAndSecurityReviewV6 } from "./contracts";
import { validateProductionArchitectureAndSecurityReviewV6 } from "./contracts";
import { evaluateProductionArchitectureAndSecurityReviewV6 } from "./policy";

export function assessRelease692(value: ProductionArchitectureAndSecurityReviewV6) {
  const validationErrors = validateProductionArchitectureAndSecurityReviewV6(value);
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
    decision: evaluateProductionArchitectureAndSecurityReviewV6(value)
  };
}
