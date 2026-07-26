import type { BatchAndStreamProcessingGovernance } from "./contracts";
import { validateBatchAndStreamProcessingGovernance } from "./contracts";
import { evaluateBatchAndStreamProcessingGovernance } from "./policy";

export function assessRelease433(value: BatchAndStreamProcessingGovernance) {
  const validationErrors = validateBatchAndStreamProcessingGovernance(value);
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
    decision: evaluateBatchAndStreamProcessingGovernance(value)
  };
}
