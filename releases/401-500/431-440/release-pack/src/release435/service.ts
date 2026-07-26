import type { DataLineageAndImpactAnalysisV2 } from "./contracts";
import { validateDataLineageAndImpactAnalysisV2 } from "./contracts";
import { evaluateDataLineageAndImpactAnalysisV2 } from "./policy";

export function assessRelease435(value: DataLineageAndImpactAnalysisV2) {
  const validationErrors = validateDataLineageAndImpactAnalysisV2(value);
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
    decision: evaluateDataLineageAndImpactAnalysisV2(value)
  };
}
