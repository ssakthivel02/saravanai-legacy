import type { SyntheticDataAndPrivacyBoundary } from "./contracts";
import { validateSyntheticDataAndPrivacyBoundary } from "./contracts";
import { evaluateSyntheticDataAndPrivacyBoundary } from "./policy";

export function assessRelease873(value: SyntheticDataAndPrivacyBoundary) {
  const validationErrors = validateSyntheticDataAndPrivacyBoundary(value);
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
    decision: evaluateSyntheticDataAndPrivacyBoundary(value)
  };
}
