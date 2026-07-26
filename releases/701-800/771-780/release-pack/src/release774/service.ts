import type { EnterpriseSemanticAndMetricsLayer } from "./contracts";
import { validateEnterpriseSemanticAndMetricsLayer } from "./contracts";
import { evaluateEnterpriseSemanticAndMetricsLayer } from "./policy";

export function assessRelease774(value: EnterpriseSemanticAndMetricsLayer) {
  const validationErrors = validateEnterpriseSemanticAndMetricsLayer(value);
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
    decision: evaluateEnterpriseSemanticAndMetricsLayer(value)
  };
}
