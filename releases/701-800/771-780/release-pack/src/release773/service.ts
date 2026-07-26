import type { MasterAndReferenceDataGovernance } from "./contracts";
import { validateMasterAndReferenceDataGovernance } from "./contracts";
import { evaluateMasterAndReferenceDataGovernance } from "./policy";

export function assessRelease773(value: MasterAndReferenceDataGovernance) {
  const validationErrors = validateMasterAndReferenceDataGovernance(value);
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
    decision: evaluateMasterAndReferenceDataGovernance(value)
  };
}
