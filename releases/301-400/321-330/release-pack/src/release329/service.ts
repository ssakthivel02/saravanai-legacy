import type { CryptographicIncidentResponse } from "./contracts";
import { validateCryptographicIncidentResponse } from "./contracts";
import { evaluateCryptographicIncidentResponse } from "./policy";

export function assessRelease329(value: CryptographicIncidentResponse) {
  const validationErrors = validateCryptographicIncidentResponse(value);
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
    decision: evaluateCryptographicIncidentResponse(value)
  };
}
