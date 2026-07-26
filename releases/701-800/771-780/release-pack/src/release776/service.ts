import type { DataQualityRulesAndObservability } from "./contracts";
import { validateDataQualityRulesAndObservability } from "./contracts";
import { evaluateDataQualityRulesAndObservability } from "./policy";

export function assessRelease776(value: DataQualityRulesAndObservability) {
  const validationErrors = validateDataQualityRulesAndObservability(value);
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
    decision: evaluateDataQualityRulesAndObservability(value)
  };
}
