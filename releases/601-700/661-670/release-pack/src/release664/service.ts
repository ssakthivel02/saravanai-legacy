import type { AnomalyDetectionAndAlertQuality } from "./contracts";
import { validateAnomalyDetectionAndAlertQuality } from "./contracts";
import { evaluateAnomalyDetectionAndAlertQuality } from "./policy";

export function assessRelease664(value: AnomalyDetectionAndAlertQuality) {
  const validationErrors = validateAnomalyDetectionAndAlertQuality(value);
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
    decision: evaluateAnomalyDetectionAndAlertQuality(value)
  };
}
