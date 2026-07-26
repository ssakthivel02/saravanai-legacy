import type { DataDeletionAndCryptographicErasure } from "./contracts";
import { validateDataDeletionAndCryptographicErasure } from "./contracts";
import { evaluateDataDeletionAndCryptographicErasure } from "./policy";

export function assessRelease639(value: DataDeletionAndCryptographicErasure) {
  const validationErrors = validateDataDeletionAndCryptographicErasure(value);
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
    decision: evaluateDataDeletionAndCryptographicErasure(value)
  };
}
