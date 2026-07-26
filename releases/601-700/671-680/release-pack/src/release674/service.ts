import type { RulesAndDecisionTableGovernance } from "./contracts";
import { validateRulesAndDecisionTableGovernance } from "./contracts";
import { evaluateRulesAndDecisionTableGovernance } from "./policy";

export function assessRelease674(value: RulesAndDecisionTableGovernance) {
  const validationErrors = validateRulesAndDecisionTableGovernance(value);
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
    decision: evaluateRulesAndDecisionTableGovernance(value)
  };
}
