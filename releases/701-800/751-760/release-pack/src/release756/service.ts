import type { OTVulnerabilityAndPatchReadiness } from "./contracts";
import { validateOTVulnerabilityAndPatchReadiness } from "./contracts";
import { evaluateOTVulnerabilityAndPatchReadiness } from "./policy";

export function assessRelease756(value: OTVulnerabilityAndPatchReadiness) {
  const validationErrors = validateOTVulnerabilityAndPatchReadiness(value);
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
    decision: evaluateOTVulnerabilityAndPatchReadiness(value)
  };
}
