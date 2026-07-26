import type { OTSecurityMonitoringAndIncidentResponse } from "./contracts";
import { validateOTSecurityMonitoringAndIncidentResponse } from "./contracts";
import { evaluateOTSecurityMonitoringAndIncidentResponse } from "./policy";

export function assessRelease758(value: OTSecurityMonitoringAndIncidentResponse) {
  const validationErrors = validateOTSecurityMonitoringAndIncidentResponse(value);
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
    decision: evaluateOTSecurityMonitoringAndIncidentResponse(value)
  };
}
