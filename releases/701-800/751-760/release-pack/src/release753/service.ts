import type { IndustrialEdgeWorkloadGovernance } from "./contracts";
import { validateIndustrialEdgeWorkloadGovernance } from "./contracts";
import { evaluateIndustrialEdgeWorkloadGovernance } from "./policy";

export function assessRelease753(value: IndustrialEdgeWorkloadGovernance) {
  const validationErrors = validateIndustrialEdgeWorkloadGovernance(value);
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
    decision: evaluateIndustrialEdgeWorkloadGovernance(value)
  };
}
