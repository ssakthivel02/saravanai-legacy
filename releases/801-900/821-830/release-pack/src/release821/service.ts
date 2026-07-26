import type { AgentExecutionRequestAndPurposeContract } from "./contracts";
import { validateAgentExecutionRequestAndPurposeContract } from "./contracts";
import { evaluateAgentExecutionRequestAndPurposeContract } from "./policy";

export function assessRelease821(value: AgentExecutionRequestAndPurposeContract) {
  const validationErrors = validateAgentExecutionRequestAndPurposeContract(value);
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
    decision: evaluateAgentExecutionRequestAndPurposeContract(value)
  };
}
