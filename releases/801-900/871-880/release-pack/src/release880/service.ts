import type { DigitalTwinAndSimulationActivationGate } from "./contracts";
import { validateDigitalTwinAndSimulationActivationGate } from "./contracts";
import { evaluateDigitalTwinAndSimulationActivationGate } from "./policy";

export function assessRelease880(value: DigitalTwinAndSimulationActivationGate) {
  const validationErrors = validateDigitalTwinAndSimulationActivationGate(value);
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
    decision: evaluateDigitalTwinAndSimulationActivationGate(value)
  };
}
