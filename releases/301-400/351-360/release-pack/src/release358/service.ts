import type { PartnerPerformanceAndRiskMonitoring } from "./contracts";
import { validatePartnerPerformanceAndRiskMonitoring } from "./contracts";
import { evaluatePartnerPerformanceAndRiskMonitoring } from "./policy";

export function assessRelease358(value: PartnerPerformanceAndRiskMonitoring) {
  const validationErrors = validatePartnerPerformanceAndRiskMonitoring(value);
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
    decision: evaluatePartnerPerformanceAndRiskMonitoring(value)
  };
}
