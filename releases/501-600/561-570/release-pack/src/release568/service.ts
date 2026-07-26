import type { VolunteerAndCommunityCoordination } from "./contracts";
import { validateVolunteerAndCommunityCoordination } from "./contracts";
import { evaluateVolunteerAndCommunityCoordination } from "./policy";

export function assessRelease568(value: VolunteerAndCommunityCoordination) {
  const validationErrors = validateVolunteerAndCommunityCoordination(value);
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
    decision: evaluateVolunteerAndCommunityCoordination(value)
  };
}
