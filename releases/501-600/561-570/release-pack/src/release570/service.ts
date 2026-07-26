import type { PublicSafetyAndHumanitarianAssuranceGate } from "./contracts";
import { validatePublicSafetyAndHumanitarianAssuranceGate } from "./contracts";
import { evaluatePublicSafetyAndHumanitarianAssuranceGate } from "./policy";

export function assessRelease570(value: PublicSafetyAndHumanitarianAssuranceGate) {
  const validationErrors = validatePublicSafetyAndHumanitarianAssuranceGate(value);
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
    decision: evaluatePublicSafetyAndHumanitarianAssuranceGate(value)
  };
}
