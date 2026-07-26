import type { SupportTrainingAndCertificationReadiness } from "./contracts";
import { validateSupportTrainingAndCertificationReadiness } from "./contracts";
import { evaluateSupportTrainingAndCertificationReadiness } from "./policy";

export function assessRelease596(value: SupportTrainingAndCertificationReadiness) {
  const validationErrors = validateSupportTrainingAndCertificationReadiness(value);
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
    decision: evaluateSupportTrainingAndCertificationReadiness(value)
  };
}
