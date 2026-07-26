import type { AIRuntimeServiceRegistry } from "./contracts";
import { validateAIRuntimeServiceRegistry } from "./contracts";
import { evaluateAIRuntimeServiceRegistry } from "./policy";

export function assessRelease601(value: AIRuntimeServiceRegistry) {
  const validationErrors = validateAIRuntimeServiceRegistry(value);
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
    decision: evaluateAIRuntimeServiceRegistry(value)
  };
}
