import type { DeveloperEnvironmentAndToolchainGovernance } from "./contracts";
import { validateDeveloperEnvironmentAndToolchainGovernance } from "./contracts";
import { evaluateDeveloperEnvironmentAndToolchainGovernance } from "./policy";

export function assessRelease475(value: DeveloperEnvironmentAndToolchainGovernance) {
  const validationErrors = validateDeveloperEnvironmentAndToolchainGovernance(value);
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
    decision: evaluateDeveloperEnvironmentAndToolchainGovernance(value)
  };
}
