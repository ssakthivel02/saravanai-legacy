import type { AgentSandboxAndResourceIsolation } from "./contracts";
import { validateAgentSandboxAndResourceIsolation } from "./contracts";
import { evaluateAgentSandboxAndResourceIsolation } from "./policy";

export function assessRelease615(value: AgentSandboxAndResourceIsolation) {
  const validationErrors = validateAgentSandboxAndResourceIsolation(value);
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
    decision: evaluateAgentSandboxAndResourceIsolation(value)
  };
}
