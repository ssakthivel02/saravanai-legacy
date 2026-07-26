import type { DelegatedGuardianAndRepresentativeAccess } from "./contracts";
import { validateDelegatedGuardianAndRepresentativeAccess } from "./contracts";
import { evaluateDelegatedGuardianAndRepresentativeAccess } from "./policy";

export function assessRelease545(value: DelegatedGuardianAndRepresentativeAccess) {
  const validationErrors = validateDelegatedGuardianAndRepresentativeAccess(value);
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
    decision: evaluateDelegatedGuardianAndRepresentativeAccess(value)
  };
}
