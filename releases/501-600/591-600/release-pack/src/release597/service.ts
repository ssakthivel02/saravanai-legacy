import type { ProductionChangeAndReleaseControlV3 } from "./contracts";
import { validateProductionChangeAndReleaseControlV3 } from "./contracts";
import { evaluateProductionChangeAndReleaseControlV3 } from "./policy";

export function assessRelease597(value: ProductionChangeAndReleaseControlV3) {
  const validationErrors = validateProductionChangeAndReleaseControlV3(value);
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
    decision: evaluateProductionChangeAndReleaseControlV3(value)
  };
}
