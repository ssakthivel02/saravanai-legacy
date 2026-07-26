import type { DeveloperWorkspaceAndRepositoryBoundary } from "./contracts";
import { validateDeveloperWorkspaceAndRepositoryBoundary } from "./contracts";
import { evaluateDeveloperWorkspaceAndRepositoryBoundary } from "./policy";

export function assessRelease651(value: DeveloperWorkspaceAndRepositoryBoundary) {
  const validationErrors = validateDeveloperWorkspaceAndRepositoryBoundary(value);
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
    decision: evaluateDeveloperWorkspaceAndRepositoryBoundary(value)
  };
}
