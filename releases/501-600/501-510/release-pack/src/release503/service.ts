import type { ScenarioAndCounterfactualAnalysis } from "./contracts";
import { validateScenarioAndCounterfactualAnalysis } from "./contracts";
import { evaluateScenarioAndCounterfactualAnalysis } from "./policy";

export function assessRelease503(value: ScenarioAndCounterfactualAnalysis) {
  const validationErrors = validateScenarioAndCounterfactualAnalysis(value);
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
    decision: evaluateScenarioAndCounterfactualAnalysis(value)
  };
}
