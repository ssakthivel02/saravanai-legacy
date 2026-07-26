import type { RecordsManagementAndDefensibleDisposal } from "./contracts";
import { validateRecordsManagementAndDefensibleDisposal } from "./contracts";
import { evaluateRecordsManagementAndDefensibleDisposal } from "./policy";

export function assessRelease486(value: RecordsManagementAndDefensibleDisposal) {
  const validationErrors = validateRecordsManagementAndDefensibleDisposal(value);
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
    decision: evaluateRecordsManagementAndDefensibleDisposal(value)
  };
}
