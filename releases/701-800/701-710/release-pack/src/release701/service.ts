import type { AIEvaluationDatasetRegistry } from "./contracts";
import { validateAIEvaluationDatasetRegistry } from "./contracts";
import { evaluateAIEvaluationDatasetRegistry } from "./policy";

export function assessRelease701(value: AIEvaluationDatasetRegistry) {
  const validationErrors = validateAIEvaluationDatasetRegistry(value);
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
    decision: evaluateAIEvaluationDatasetRegistry(value)
  };
}
