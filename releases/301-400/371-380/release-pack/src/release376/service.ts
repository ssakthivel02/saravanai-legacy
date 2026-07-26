import type { CrisisCommandAndStakeholderCommunications } from "./contracts";
import { validateCrisisCommandAndStakeholderCommunications } from "./contracts";
import { evaluateCrisisCommandAndStakeholderCommunications } from "./policy";

export function assessRelease376(value: CrisisCommandAndStakeholderCommunications) {
  const validationErrors = validateCrisisCommandAndStakeholderCommunications(value);
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
    decision: evaluateCrisisCommandAndStakeholderCommunications(value)
  };
}
