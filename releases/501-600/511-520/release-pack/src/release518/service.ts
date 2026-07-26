import type { SyntheticMediaProvenanceAndDisclosureV2 } from "./contracts";
import { validateSyntheticMediaProvenanceAndDisclosureV2 } from "./contracts";
import { evaluateSyntheticMediaProvenanceAndDisclosureV2 } from "./policy";

export function assessRelease518(value: SyntheticMediaProvenanceAndDisclosureV2) {
  const validationErrors = validateSyntheticMediaProvenanceAndDisclosureV2(value);
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
    decision: evaluateSyntheticMediaProvenanceAndDisclosureV2(value)
  };
}
