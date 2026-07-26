import type { OrganisationTeamAndProjectRuntime } from "./contracts";
import { validateOrganisationTeamAndProjectRuntime } from "./contracts";
import { evaluateOrganisationTeamAndProjectRuntime } from "./policy";

export function assessRelease803(value: OrganisationTeamAndProjectRuntime) {
  const validationErrors = validateOrganisationTeamAndProjectRuntime(value);
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
    decision: evaluateOrganisationTeamAndProjectRuntime(value)
  };
}
