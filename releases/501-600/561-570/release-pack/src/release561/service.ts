import type { EmergencyInformationVerification } from "./contracts";
import { validateEmergencyInformationVerification } from "./contracts";
import { evaluateEmergencyInformationVerification } from "./policy";

export function assessRelease561(value: EmergencyInformationVerification) {
  const validationErrors = validateEmergencyInformationVerification(value);
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
    decision: evaluateEmergencyInformationVerification(value)
  };
}
