import type { ComputeClusterAndVirtualisationOperations } from "./contracts";
import { validateComputeClusterAndVirtualisationOperations } from "./contracts";
import { evaluateComputeClusterAndVirtualisationOperations } from "./policy";

export function assessRelease766(value: ComputeClusterAndVirtualisationOperations) {
  const validationErrors = validateComputeClusterAndVirtualisationOperations(value);
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
    decision: evaluateComputeClusterAndVirtualisationOperations(value)
  };
}
