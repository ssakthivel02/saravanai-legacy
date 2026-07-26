import type { MergerAcquisitionAndDivestitureIntegration } from "./contracts";
import { validateMergerAcquisitionAndDivestitureIntegration } from "./contracts";
import { evaluateMergerAcquisitionAndDivestitureIntegration } from "./policy";

export function assessRelease393(value: MergerAcquisitionAndDivestitureIntegration) {
  const validationErrors = validateMergerAcquisitionAndDivestitureIntegration(value);
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
    decision: evaluateMergerAcquisitionAndDivestitureIntegration(value)
  };
}
