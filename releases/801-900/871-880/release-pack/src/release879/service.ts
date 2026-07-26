import type { SimulationModelDriftAndRecalibration } from "./contracts";
import { validateSimulationModelDriftAndRecalibration } from "./contracts";
import { evaluateSimulationModelDriftAndRecalibration } from "./policy";

export function assessRelease879(value: SimulationModelDriftAndRecalibration) {
  const validationErrors = validateSimulationModelDriftAndRecalibration(value);
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
    decision: evaluateSimulationModelDriftAndRecalibration(value)
  };
}
