import type { AgentMemoryScopeAndExpiry } from "./contracts";
import { validateAgentMemoryScopeAndExpiry } from "./contracts";
import { evaluateAgentMemoryScopeAndExpiry } from "./policy";

export function assessRelease616(value: AgentMemoryScopeAndExpiry) {
  const validationErrors = validateAgentMemoryScopeAndExpiry(value);
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
    decision: evaluateAgentMemoryScopeAndExpiry(value)
  };
}
