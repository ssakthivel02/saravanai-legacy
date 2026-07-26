import type { AgentToolProtocolGateway } from "./contracts";
import { validateAgentToolProtocolGateway } from "./contracts";
import { evaluateAgentToolProtocolGateway } from "./policy";

export function assessRelease525(value: AgentToolProtocolGateway) {
  const validationErrors = validateAgentToolProtocolGateway(value);
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
    decision: evaluateAgentToolProtocolGateway(value)
  };
}
