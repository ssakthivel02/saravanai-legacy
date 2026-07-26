import type { CIPipelineReliabilityEngineering } from "./contracts";
import { validateCIPipelineReliabilityEngineering } from "./contracts";
import { evaluateCIPipelineReliabilityEngineering } from "./policy";

export function assessRelease474(value: CIPipelineReliabilityEngineering) {
  const validationErrors = validateCIPipelineReliabilityEngineering(value);
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
    decision: evaluateCIPipelineReliabilityEngineering(value)
  };
}
