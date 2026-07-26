import type { HumanitarianDataProtection } from "./contracts";
import { validateHumanitarianDataProtection } from "./contracts";
import { evaluateHumanitarianDataProtection } from "./policy";

export function assessRelease564(value: HumanitarianDataProtection) {
  const validationErrors = validateHumanitarianDataProtection(value);
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
    decision: evaluateHumanitarianDataProtection(value)
  };
}
