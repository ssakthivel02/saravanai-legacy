import type { AgentKillSwitchAndEmergencyStop } from "./contracts";
import { validateAgentKillSwitchAndEmergencyStop } from "./contracts";
import { evaluateAgentKillSwitchAndEmergencyStop } from "./policy";

export function assessRelease828(value: AgentKillSwitchAndEmergencyStop) {
  const validationErrors = validateAgentKillSwitchAndEmergencyStop(value);
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
    decision: evaluateAgentKillSwitchAndEmergencyStop(value)
  };
}
