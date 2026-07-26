import type { CommunityAndPublicInterestImpact } from "./contracts";
import { validateCommunityAndPublicInterestImpact } from "./contracts";
import { evaluateCommunityAndPublicInterestImpact } from "./policy";

export function assessRelease467(value: CommunityAndPublicInterestImpact) {
  const validationErrors = validateCommunityAndPublicInterestImpact(value);
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
    decision: evaluateCommunityAndPublicInterestImpact(value)
  };
}
