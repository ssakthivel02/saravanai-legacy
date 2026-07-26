import type { AgentCommunicationProtocols } from "./contracts";
import { validateAgentCommunicationProtocols } from "./contracts";
import { evaluateAgentCommunicationProtocols } from "./policy";

export function assessRelease314(value: AgentCommunicationProtocols) {
  const validationErrors = validateAgentCommunicationProtocols(value);
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
    decision: evaluateAgentCommunicationProtocols(value)
  };
}
