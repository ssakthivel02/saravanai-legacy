import type { SimulationExecutionSandboxRuntime } from "./contracts";
import { validateSimulationExecutionSandboxRuntime } from "./contracts";
import { evaluateSimulationExecutionSandboxRuntime } from "./policy";

export function assessRelease874(value: SimulationExecutionSandboxRuntime) {
  const validationErrors = validateSimulationExecutionSandboxRuntime(value);
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
    decision: evaluateSimulationExecutionSandboxRuntime(value)
  };
}
