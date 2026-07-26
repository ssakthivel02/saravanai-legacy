import type { EphemeralEnvironmentGovernance } from "./contracts";
import { validateEphemeralEnvironmentGovernance } from "./contracts";
import { evaluateEphemeralEnvironmentGovernance } from "./policy";

export function assessRelease338(value: EphemeralEnvironmentGovernance) {
  const validationErrors = validateEphemeralEnvironmentGovernance(value);
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
    decision: evaluateEphemeralEnvironmentGovernance(value)
  };
}
