import type { DataQualityRulesAndObservabilityV2 } from "./contracts";
import { validateDataQualityRulesAndObservabilityV2 } from "./contracts";
import { evaluateDataQualityRulesAndObservabilityV2 } from "./policy";

export function assessRelease434(value: DataQualityRulesAndObservabilityV2) {
  const validationErrors = validateDataQualityRulesAndObservabilityV2(value);
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
    decision: evaluateDataQualityRulesAndObservabilityV2(value)
  };
}
