import type { AIGatewayProductionActivationGate } from "./contracts";
import { validateAIGatewayProductionActivationGate } from "./contracts";
import { evaluateAIGatewayProductionActivationGate } from "./policy";

export function assessRelease820(value: AIGatewayProductionActivationGate) {
  const validationErrors = validateAIGatewayProductionActivationGate(value);
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
    decision: evaluateAIGatewayProductionActivationGate(value)
  };
}
