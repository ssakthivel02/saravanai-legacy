import type { PerformanceEfficiencyAndCostRegression } from "./contracts";
import { validatePerformanceEfficiencyAndCostRegression } from "./contracts";
import { evaluatePerformanceEfficiencyAndCostRegression } from "./policy";

export function assessRelease887(value: PerformanceEfficiencyAndCostRegression) {
  const validationErrors = validatePerformanceEfficiencyAndCostRegression(value);
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
    decision: evaluatePerformanceEfficiencyAndCostRegression(value)
  };
}
