import type { ElectronicSignatureAndEvidenceReadiness } from "./contracts";
import { validateElectronicSignatureAndEvidenceReadiness } from "./contracts";
import { evaluateElectronicSignatureAndEvidenceReadiness } from "./policy";

export function assessRelease485(value: ElectronicSignatureAndEvidenceReadiness) {
  const validationErrors = validateElectronicSignatureAndEvidenceReadiness(value);
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
    decision: evaluateElectronicSignatureAndEvidenceReadiness(value)
  };
}
