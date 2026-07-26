import type { DigitalTrustTransparencyReporting } from "./contracts";
import { validateDigitalTrustTransparencyReporting } from "./contracts";
import { evaluateDigitalTrustTransparencyReporting } from "./policy";

export function assessRelease488(value: DigitalTrustTransparencyReporting) {
  const validationErrors = validateDigitalTrustTransparencyReporting(value);
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
    decision: evaluateDigitalTrustTransparencyReporting(value)
  };
}
