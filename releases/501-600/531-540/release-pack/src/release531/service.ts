import type { CyberRecoveryServiceCatalogue } from "./contracts";
import { validateCyberRecoveryServiceCatalogue } from "./contracts";
import { evaluateCyberRecoveryServiceCatalogue } from "./policy";

export function assessRelease531(value: CyberRecoveryServiceCatalogue) {
  const validationErrors = validateCyberRecoveryServiceCatalogue(value);
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
    decision: evaluateCyberRecoveryServiceCatalogue(value)
  };
}
