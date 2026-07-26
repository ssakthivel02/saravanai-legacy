import type { ExecutiveDecisionBriefAndBoardPack } from "./contracts";
import { validateExecutiveDecisionBriefAndBoardPack } from "./contracts";
import { evaluateExecutiveDecisionBriefAndBoardPack } from "./policy";

export function assessRelease785(value: ExecutiveDecisionBriefAndBoardPack) {
  const validationErrors = validateExecutiveDecisionBriefAndBoardPack(value);
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
    decision: evaluateExecutiveDecisionBriefAndBoardPack(value)
  };
}
