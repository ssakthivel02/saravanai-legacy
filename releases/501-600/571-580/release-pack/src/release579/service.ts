import type { ValueTransparencyAndExecutiveReporting } from "./contracts";
import { validateValueTransparencyAndExecutiveReporting } from "./contracts";
import { evaluateValueTransparencyAndExecutiveReporting } from "./policy";

export function assessRelease579(value: ValueTransparencyAndExecutiveReporting) {
  const validationErrors = validateValueTransparencyAndExecutiveReporting(value);
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
    decision: evaluateValueTransparencyAndExecutiveReporting(value)
  };
}
