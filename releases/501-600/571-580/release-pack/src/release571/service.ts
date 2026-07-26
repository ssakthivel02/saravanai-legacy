import type { CostModelAndUnitEconomicsRegistry } from "./contracts";
import { validateCostModelAndUnitEconomicsRegistry } from "./contracts";
import { evaluateCostModelAndUnitEconomicsRegistry } from "./policy";

export function assessRelease571(value: CostModelAndUnitEconomicsRegistry) {
  const validationErrors = validateCostModelAndUnitEconomicsRegistry(value);
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
    decision: evaluateCostModelAndUnitEconomicsRegistry(value)
  };
}
