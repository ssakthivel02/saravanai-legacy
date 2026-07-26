import type { ExposureAndVulnerabilityPrioritisation } from "./contracts";
import { validateExposureAndVulnerabilityPrioritisation } from "./contracts";
import { evaluateExposureAndVulnerabilityPrioritisation } from "./policy";

export function assessRelease426(value: ExposureAndVulnerabilityPrioritisation) {
  const validationErrors = validateExposureAndVulnerabilityPrioritisation(value);
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
    decision: evaluateExposureAndVulnerabilityPrioritisation(value)
  };
}
