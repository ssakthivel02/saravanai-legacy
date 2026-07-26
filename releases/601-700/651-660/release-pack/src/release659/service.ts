import type { DeveloperPlatformIncidentAndRecovery } from "./contracts";
import { validateDeveloperPlatformIncidentAndRecovery } from "./contracts";
import { evaluateDeveloperPlatformIncidentAndRecovery } from "./policy";

export function assessRelease659(value: DeveloperPlatformIncidentAndRecovery) {
  const validationErrors = validateDeveloperPlatformIncidentAndRecovery(value);
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
    decision: evaluateDeveloperPlatformIncidentAndRecovery(value)
  };
}
