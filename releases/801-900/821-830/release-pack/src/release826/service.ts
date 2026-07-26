import type { AgentSandboxNetworkAndFileBoundary } from "./contracts";
import { validateAgentSandboxNetworkAndFileBoundary } from "./contracts";
import { evaluateAgentSandboxNetworkAndFileBoundary } from "./policy";

export function assessRelease826(value: AgentSandboxNetworkAndFileBoundary) {
  const validationErrors = validateAgentSandboxNetworkAndFileBoundary(value);
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
    decision: evaluateAgentSandboxNetworkAndFileBoundary(value)
  };
}
