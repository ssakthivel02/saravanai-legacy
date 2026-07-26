import type { SemanticLayerAndMetricGovernance } from "./contracts";
import { validateSemanticLayerAndMetricGovernance } from "./contracts";
import { evaluateSemanticLayerAndMetricGovernance } from "./policy";

export function assessRelease342(value: SemanticLayerAndMetricGovernance) {
  const validationErrors = validateSemanticLayerAndMetricGovernance(value);
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
    decision: evaluateSemanticLayerAndMetricGovernance(value)
  };
}
