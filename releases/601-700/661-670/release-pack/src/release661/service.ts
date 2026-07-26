import type { TelemetryContractAndSignalRegistry } from "./contracts";
import { validateTelemetryContractAndSignalRegistry } from "./contracts";
import { evaluateTelemetryContractAndSignalRegistry } from "./policy";

export function assessRelease661(value: TelemetryContractAndSignalRegistry) {
  const validationErrors = validateTelemetryContractAndSignalRegistry(value);
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
    decision: evaluateTelemetryContractAndSignalRegistry(value)
  };
}
