import type { PolicyAsCodeDistribution } from "./contracts";
import { validatePolicyAsCodeDistribution } from "./contracts";
import { evaluatePolicyAsCodeDistribution } from "./policy";

export function assessRelease334(value: PolicyAsCodeDistribution) {
  const validationErrors = validatePolicyAsCodeDistribution(value);
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
    decision: evaluatePolicyAsCodeDistribution(value)
  };
}
