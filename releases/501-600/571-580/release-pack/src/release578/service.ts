import type { EconomicRiskAndSensitivityTesting } from "./contracts";
import { validateEconomicRiskAndSensitivityTesting } from "./contracts";
import { evaluateEconomicRiskAndSensitivityTesting } from "./policy";

export function assessRelease578(value: EconomicRiskAndSensitivityTesting) {
  const validationErrors = validateEconomicRiskAndSensitivityTesting(value);
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
    decision: evaluateEconomicRiskAndSensitivityTesting(value)
  };
}
