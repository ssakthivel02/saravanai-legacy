import type { ScenarioComparisonAndSensitivityAnalysis } from "./contracts";
import { validateScenarioComparisonAndSensitivityAnalysis } from "./contracts";
import { evaluateScenarioComparisonAndSensitivityAnalysis } from "./policy";

export function assessRelease875(value: ScenarioComparisonAndSensitivityAnalysis) {
  const validationErrors = validateScenarioComparisonAndSensitivityAnalysis(value);
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
    decision: evaluateScenarioComparisonAndSensitivityAnalysis(value)
  };
}
