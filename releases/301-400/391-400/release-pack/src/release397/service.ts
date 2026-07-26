import type { BoardGovernanceAndDecisionTraceabilityV2 } from "./contracts";
import { validateBoardGovernanceAndDecisionTraceabilityV2 } from "./contracts";
import { evaluateBoardGovernanceAndDecisionTraceabilityV2 } from "./policy";

export function assessRelease397(value: BoardGovernanceAndDecisionTraceabilityV2) {
  const validationErrors = validateBoardGovernanceAndDecisionTraceabilityV2(value);
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
    decision: evaluateBoardGovernanceAndDecisionTraceabilityV2(value)
  };
}
