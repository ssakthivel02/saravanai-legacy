import type { AgentToolPermissionCompiler } from "./contracts";
import { validateAgentToolPermissionCompiler } from "./contracts";
import { evaluateAgentToolPermissionCompiler } from "./policy";

export function assessRelease313(value: AgentToolPermissionCompiler) {
  const validationErrors = validateAgentToolPermissionCompiler(value);
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
    decision: evaluateAgentToolPermissionCompiler(value)
  };
}
