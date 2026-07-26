import type { AIRuntimeCapacityForecasting } from "./contracts";
import { validateAIRuntimeCapacityForecasting } from "./contracts";
import { evaluateAIRuntimeCapacityForecasting } from "./policy";

export function assessRelease609(value: AIRuntimeCapacityForecasting) {
  const validationErrors = validateAIRuntimeCapacityForecasting(value);
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
    decision: evaluateAIRuntimeCapacityForecasting(value)
  };
}
