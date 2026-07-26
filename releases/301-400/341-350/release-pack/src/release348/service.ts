import type { SyntheticDataQualityAndDisclosure } from "./contracts";
import { validateSyntheticDataQualityAndDisclosure } from "./contracts";
import { evaluateSyntheticDataQualityAndDisclosure } from "./policy";

export function assessRelease348(value: SyntheticDataQualityAndDisclosure) {
  const validationErrors = validateSyntheticDataQualityAndDisclosure(value);
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
    decision: evaluateSyntheticDataQualityAndDisclosure(value)
  };
}
