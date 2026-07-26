import type { SupplyChainContinuityAndAlternativeSourcing } from "./contracts";
import { validateSupplyChainContinuityAndAlternativeSourcing } from "./contracts";
import { evaluateSupplyChainContinuityAndAlternativeSourcing } from "./policy";

export function assessRelease377(value: SupplyChainContinuityAndAlternativeSourcing) {
  const validationErrors = validateSupplyChainContinuityAndAlternativeSourcing(value);
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
    decision: evaluateSupplyChainContinuityAndAlternativeSourcing(value)
  };
}
