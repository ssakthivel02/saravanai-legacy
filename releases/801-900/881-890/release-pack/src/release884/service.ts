import type { CloudResourceSchedulingAndRightsizing } from "./contracts";
import { validateCloudResourceSchedulingAndRightsizing } from "./contracts";
import { evaluateCloudResourceSchedulingAndRightsizing } from "./policy";

export function assessRelease884(value: CloudResourceSchedulingAndRightsizing) {
  const validationErrors = validateCloudResourceSchedulingAndRightsizing(value);
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
    decision: evaluateCloudResourceSchedulingAndRightsizing(value)
  };
}
