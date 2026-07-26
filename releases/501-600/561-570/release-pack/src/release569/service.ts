import type { PublicEventAndCrowdSafetyInformation } from "./contracts";
import { validatePublicEventAndCrowdSafetyInformation } from "./contracts";
import { evaluatePublicEventAndCrowdSafetyInformation } from "./policy";

export function assessRelease569(value: PublicEventAndCrowdSafetyInformation) {
  const validationErrors = validatePublicEventAndCrowdSafetyInformation(value);
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
    decision: evaluatePublicEventAndCrowdSafetyInformation(value)
  };
}
