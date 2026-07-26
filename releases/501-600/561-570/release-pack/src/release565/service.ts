import type { MissingPersonAndFamilyReunificationSafety } from "./contracts";
import { validateMissingPersonAndFamilyReunificationSafety } from "./contracts";
import { evaluateMissingPersonAndFamilyReunificationSafety } from "./policy";

export function assessRelease565(value: MissingPersonAndFamilyReunificationSafety) {
  const validationErrors = validateMissingPersonAndFamilyReunificationSafety(value);
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
    decision: evaluateMissingPersonAndFamilyReunificationSafety(value)
  };
}
