import type { DataProductAccessAndUsageControl } from "./contracts";
import { validateDataProductAccessAndUsageControl } from "./contracts";
import { evaluateDataProductAccessAndUsageControl } from "./policy";

export function assessRelease775(value: DataProductAccessAndUsageControl) {
  const validationErrors = validateDataProductAccessAndUsageControl(value);
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
    decision: evaluateDataProductAccessAndUsageControl(value)
  };
}
