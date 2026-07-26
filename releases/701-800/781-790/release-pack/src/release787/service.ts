import type { CrisisCommandAndStakeholderCoordination } from "./contracts";
import { validateCrisisCommandAndStakeholderCoordination } from "./contracts";
import { evaluateCrisisCommandAndStakeholderCoordination } from "./policy";

export function assessRelease787(value: CrisisCommandAndStakeholderCoordination) {
  const validationErrors = validateCrisisCommandAndStakeholderCoordination(value);
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
    decision: evaluateCrisisCommandAndStakeholderCoordination(value)
  };
}
