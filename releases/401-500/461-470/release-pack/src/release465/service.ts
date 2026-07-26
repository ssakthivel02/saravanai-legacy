import type { EnvironmentalRiskAndDependencyAssessment } from "./contracts";
import { validateEnvironmentalRiskAndDependencyAssessment } from "./contracts";
import { evaluateEnvironmentalRiskAndDependencyAssessment } from "./policy";

export function assessRelease465(value: EnvironmentalRiskAndDependencyAssessment) {
  const validationErrors = validateEnvironmentalRiskAndDependencyAssessment(value);
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
    decision: evaluateEnvironmentalRiskAndDependencyAssessment(value)
  };
}
