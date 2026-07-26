import type { ExperienceArchitectureAndDesignSystem } from "./contracts";
import { validateExperienceArchitectureAndDesignSystem } from "./contracts";
import { evaluateExperienceArchitectureAndDesignSystem } from "./policy";

export function assessRelease722(value: ExperienceArchitectureAndDesignSystem) {
  const validationErrors = validateExperienceArchitectureAndDesignSystem(value);
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
    decision: evaluateExperienceArchitectureAndDesignSystem(value)
  };
}
