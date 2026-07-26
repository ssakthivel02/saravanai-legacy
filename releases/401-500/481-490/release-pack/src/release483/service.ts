import type { ConsentAndLawfulBasisOperationsV2 } from "./contracts";
import { validateConsentAndLawfulBasisOperationsV2 } from "./contracts";
import { evaluateConsentAndLawfulBasisOperationsV2 } from "./policy";

export function assessRelease483(value: ConsentAndLawfulBasisOperationsV2) {
  const validationErrors = validateConsentAndLawfulBasisOperationsV2(value);
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
    decision: evaluateConsentAndLawfulBasisOperationsV2(value)
  };
}
