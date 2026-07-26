import type { AIGatewayRequestEnvelope } from "./contracts";
import { validateAIGatewayRequestEnvelope } from "./contracts";
import { evaluateAIGatewayRequestEnvelope } from "./policy";

export function assessRelease811(value: AIGatewayRequestEnvelope) {
  const validationErrors = validateAIGatewayRequestEnvelope(value);
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
    decision: evaluateAIGatewayRequestEnvelope(value)
  };
}
