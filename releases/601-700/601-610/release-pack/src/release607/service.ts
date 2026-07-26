import type { ModelFallbackAndDegradedService } from "./contracts";
import { validateModelFallbackAndDegradedService } from "./contracts";
import { evaluateModelFallbackAndDegradedService } from "./policy";

export function assessRelease607(value: ModelFallbackAndDegradedService) {
  const validationErrors = validateModelFallbackAndDegradedService(value);
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
    decision: evaluateModelFallbackAndDegradedService(value)
  };
}
