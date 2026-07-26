import type { ResponsibleDataValueAndSharingReadiness } from "./contracts";
import { validateResponsibleDataValueAndSharingReadiness } from "./contracts";
import { evaluateResponsibleDataValueAndSharingReadiness } from "./policy";

export function assessRelease349(value: ResponsibleDataValueAndSharingReadiness) {
  const validationErrors = validateResponsibleDataValueAndSharingReadiness(value);
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
    decision: evaluateResponsibleDataValueAndSharingReadiness(value)
  };
}
