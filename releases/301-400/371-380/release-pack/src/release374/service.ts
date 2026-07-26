import type { ChaosExperimentGovernanceV2 } from "./contracts";
import { validateChaosExperimentGovernanceV2 } from "./contracts";
import { evaluateChaosExperimentGovernanceV2 } from "./policy";

export function assessRelease374(value: ChaosExperimentGovernanceV2) {
  const validationErrors = validateChaosExperimentGovernanceV2(value);
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
    decision: evaluateChaosExperimentGovernanceV2(value)
  };
}
