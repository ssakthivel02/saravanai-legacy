import type { BusinessCapabilityAndValueStreamMap } from "./contracts";
import { validateBusinessCapabilityAndValueStreamMap } from "./contracts";
import { evaluateBusinessCapabilityAndValueStreamMap } from "./policy";

export function assessRelease441(value: BusinessCapabilityAndValueStreamMap) {
  const validationErrors = validateBusinessCapabilityAndValueStreamMap(value);
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
    decision: evaluateBusinessCapabilityAndValueStreamMap(value)
  };
}
