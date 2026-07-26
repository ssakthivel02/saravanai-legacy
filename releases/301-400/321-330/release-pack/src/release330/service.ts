import type { CryptographicAgilityAssuranceGate } from "./contracts";
import { validateCryptographicAgilityAssuranceGate } from "./contracts";
import { evaluateCryptographicAgilityAssuranceGate } from "./policy";

export function assessRelease330(value: CryptographicAgilityAssuranceGate) {
  const validationErrors = validateCryptographicAgilityAssuranceGate(value);
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
    decision: evaluateCryptographicAgilityAssuranceGate(value)
  };
}
