import type { AgentSpecificationAndCapabilityContracts } from "./contracts";
import { validateAgentSpecificationAndCapabilityContracts } from "./contracts";
import { evaluateAgentSpecificationAndCapabilityContracts } from "./policy";

export function assessRelease311(value: AgentSpecificationAndCapabilityContracts) {
  const validationErrors = validateAgentSpecificationAndCapabilityContracts(value);
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
    decision: evaluateAgentSpecificationAndCapabilityContracts(value)
  };
}
