import type { DataLineageImpactAndChangeAnalysis } from "./contracts";
import { validateDataLineageImpactAndChangeAnalysis } from "./contracts";
import { evaluateDataLineageImpactAndChangeAnalysis } from "./policy";

export function assessRelease777(value: DataLineageImpactAndChangeAnalysis) {
  const validationErrors = validateDataLineageImpactAndChangeAnalysis(value);
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
    decision: evaluateDataLineageImpactAndChangeAnalysis(value)
  };
}
