import type { AgentRuntimeIdentityAndSession } from "./contracts";
import { validateAgentRuntimeIdentityAndSession } from "./contracts";
import { evaluateAgentRuntimeIdentityAndSession } from "./policy";

export function assessRelease611(value: AgentRuntimeIdentityAndSession) {
  const validationErrors = validateAgentRuntimeIdentityAndSession(value);
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
    decision: evaluateAgentRuntimeIdentityAndSession(value)
  };
}
