import type { TestGenerationAndValidationIntelligence } from "./contracts";
import { validateTestGenerationAndValidationIntelligence } from "./contracts";
import { evaluateTestGenerationAndValidationIntelligence } from "./policy";

export function assessRelease656(value: TestGenerationAndValidationIntelligence) {
  const validationErrors = validateTestGenerationAndValidationIntelligence(value);
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
    decision: evaluateTestGenerationAndValidationIntelligence(value)
  };
}
