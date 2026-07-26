import type { PublicHealthInformationBoundary } from "./contracts";
import { validatePublicHealthInformationBoundary } from "./contracts";
import { evaluatePublicHealthInformationBoundary } from "./policy";

export function assessRelease566(value: PublicHealthInformationBoundary) {
  const validationErrors = validatePublicHealthInformationBoundary(value);
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
    decision: evaluatePublicHealthInformationBoundary(value)
  };
}
