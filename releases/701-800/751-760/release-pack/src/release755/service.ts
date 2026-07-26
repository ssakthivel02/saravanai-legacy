import type { SensorDataQualityAndMinimisation } from "./contracts";
import { validateSensorDataQualityAndMinimisation } from "./contracts";
import { evaluateSensorDataQualityAndMinimisation } from "./policy";

export function assessRelease755(value: SensorDataQualityAndMinimisation) {
  const validationErrors = validateSensorDataQualityAndMinimisation(value);
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
    decision: evaluateSensorDataQualityAndMinimisation(value)
  };
}
