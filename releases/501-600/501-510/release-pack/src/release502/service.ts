import type { EvidenceAndAssumptionLedger } from "./contracts";
import { validateEvidenceAndAssumptionLedger } from "./contracts";
import { evaluateEvidenceAndAssumptionLedger } from "./policy";

export function assessRelease502(value: EvidenceAndAssumptionLedger) {
  const validationErrors = validateEvidenceAndAssumptionLedger(value);
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
    decision: evaluateEvidenceAndAssumptionLedger(value)
  };
}
