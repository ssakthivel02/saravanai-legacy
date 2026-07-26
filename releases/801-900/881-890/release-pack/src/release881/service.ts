import type { PlatformUnitEconomicsAndCostModel } from "./contracts";
import { validatePlatformUnitEconomicsAndCostModel } from "./contracts";
import { evaluatePlatformUnitEconomicsAndCostModel } from "./policy";

export function assessRelease881(value: PlatformUnitEconomicsAndCostModel) {
  const validationErrors = validatePlatformUnitEconomicsAndCostModel(value);
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
    decision: evaluatePlatformUnitEconomicsAndCostModel(value)
  };
}
