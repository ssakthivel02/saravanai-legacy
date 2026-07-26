import type { MultiAgentCoordinationProtocolV2 } from "./contracts";
import { validateMultiAgentCoordinationProtocolV2 } from "./contracts";
import { evaluateMultiAgentCoordinationProtocolV2 } from "./policy";

export function assessRelease617(value: MultiAgentCoordinationProtocolV2) {
  const validationErrors = validateMultiAgentCoordinationProtocolV2(value);
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
    decision: evaluateMultiAgentCoordinationProtocolV2(value)
  };
}
