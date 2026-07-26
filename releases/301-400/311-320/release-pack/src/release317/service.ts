import type { AgentTestHarnessAndScenarioReplay } from "./contracts";
import { validateAgentTestHarnessAndScenarioReplay } from "./contracts";
import { evaluateAgentTestHarnessAndScenarioReplay } from "./policy";

export function assessRelease317(value: AgentTestHarnessAndScenarioReplay) {
  const validationErrors = validateAgentTestHarnessAndScenarioReplay(value);
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
    decision: evaluateAgentTestHarnessAndScenarioReplay(value)
  };
}
