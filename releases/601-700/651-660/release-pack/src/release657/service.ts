import type { InfrastructureAndPolicyCodeGovernance } from "./contracts";
import { validateInfrastructureAndPolicyCodeGovernance } from "./contracts";
import { evaluateInfrastructureAndPolicyCodeGovernance } from "./policy";

export function assessRelease657(value: InfrastructureAndPolicyCodeGovernance) {
  const validationErrors = validateInfrastructureAndPolicyCodeGovernance(value);
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
    decision: evaluateInfrastructureAndPolicyCodeGovernance(value)
  };
}
