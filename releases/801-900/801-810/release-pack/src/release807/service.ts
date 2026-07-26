import type { SessionRevocationAndDeviceTrust } from "./contracts";
import { validateSessionRevocationAndDeviceTrust } from "./contracts";
import { evaluateSessionRevocationAndDeviceTrust } from "./policy";

export function assessRelease807(value: SessionRevocationAndDeviceTrust) {
  const validationErrors = validateSessionRevocationAndDeviceTrust(value);
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
    decision: evaluateSessionRevocationAndDeviceTrust(value)
  };
}
