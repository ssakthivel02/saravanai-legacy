import type { OutputValidationAndSafetyPipeline } from "./contracts";
import { validateOutputValidationAndSafetyPipeline } from "./contracts";
import { evaluateOutputValidationAndSafetyPipeline } from "./policy";

export function assessRelease815(value: OutputValidationAndSafetyPipeline) {
  const validationErrors = validateOutputValidationAndSafetyPipeline(value);
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
    decision: evaluateOutputValidationAndSafetyPipeline(value)
  };
}
