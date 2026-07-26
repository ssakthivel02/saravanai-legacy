import type { OperationalForecastAndCapacitySimulation } from "./contracts";
import { validateOperationalForecastAndCapacitySimulation } from "./contracts";
import { evaluateOperationalForecastAndCapacitySimulation } from "./policy";

export function assessRelease876(value: OperationalForecastAndCapacitySimulation) {
  const validationErrors = validateOperationalForecastAndCapacitySimulation(value);
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
    decision: evaluateOperationalForecastAndCapacitySimulation(value)
  };
}
