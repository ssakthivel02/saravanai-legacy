import type { ApplicationProductBriefAndRequirements } from "./contracts";
import { validateApplicationProductBriefAndRequirements } from "./contracts";
import { evaluateApplicationProductBriefAndRequirements } from "./policy";

export function assessRelease721(value: ApplicationProductBriefAndRequirements) {
  const validationErrors = validateApplicationProductBriefAndRequirements(value);
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
    decision: evaluateApplicationProductBriefAndRequirements(value)
  };
}
