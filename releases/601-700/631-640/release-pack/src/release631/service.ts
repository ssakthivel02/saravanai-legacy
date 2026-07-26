import type { DataResidencyAndSovereigntyRegistry } from "./contracts";
import { validateDataResidencyAndSovereigntyRegistry } from "./contracts";
import { evaluateDataResidencyAndSovereigntyRegistry } from "./policy";

export function assessRelease631(value: DataResidencyAndSovereigntyRegistry) {
  const validationErrors = validateDataResidencyAndSovereigntyRegistry(value);
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
    decision: evaluateDataResidencyAndSovereigntyRegistry(value)
  };
}
