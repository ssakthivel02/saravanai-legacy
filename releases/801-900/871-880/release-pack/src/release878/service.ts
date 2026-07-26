import type { HumanDecisionAndSimulationReviewBoard } from "./contracts";
import { validateHumanDecisionAndSimulationReviewBoard } from "./contracts";
import { evaluateHumanDecisionAndSimulationReviewBoard } from "./policy";

export function assessRelease878(value: HumanDecisionAndSimulationReviewBoard) {
  const validationErrors = validateHumanDecisionAndSimulationReviewBoard(value);
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
    decision: evaluateHumanDecisionAndSimulationReviewBoard(value)
  };
}
