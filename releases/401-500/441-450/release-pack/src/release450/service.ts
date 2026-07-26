import type { BusinessArchitectureAndIntegrationGate } from "./contracts";
import { validateBusinessArchitectureAndIntegrationGate } from "./contracts";
import { evaluateBusinessArchitectureAndIntegrationGate } from "./policy";

export function assessRelease450(value: BusinessArchitectureAndIntegrationGate) {
  const validationErrors = validateBusinessArchitectureAndIntegrationGate(value);
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
    decision: evaluateBusinessArchitectureAndIntegrationGate(value)
  };
}
