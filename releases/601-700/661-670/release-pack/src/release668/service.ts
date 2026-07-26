import type { ReliabilityExperimentAndChaosGovernance } from "./contracts";
import { validateReliabilityExperimentAndChaosGovernance } from "./contracts";
import { evaluateReliabilityExperimentAndChaosGovernance } from "./policy";

export function assessRelease668(value: ReliabilityExperimentAndChaosGovernance) {
  const validationErrors = validateReliabilityExperimentAndChaosGovernance(value);
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
    decision: evaluateReliabilityExperimentAndChaosGovernance(value)
  };
}
