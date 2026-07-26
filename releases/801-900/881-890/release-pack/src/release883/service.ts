import type { CapacityForecastAndAdmissionPlanning } from "./contracts";
import { validateCapacityForecastAndAdmissionPlanning } from "./contracts";
import { evaluateCapacityForecastAndAdmissionPlanning } from "./policy";

export function assessRelease883(value: CapacityForecastAndAdmissionPlanning) {
  const validationErrors = validateCapacityForecastAndAdmissionPlanning(value);
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
    decision: evaluateCapacityForecastAndAdmissionPlanning(value)
  };
}
