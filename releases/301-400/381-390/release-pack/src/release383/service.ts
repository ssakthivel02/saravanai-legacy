import type { MultilingualTerminologyAndTranslationOperationsV2 } from "./contracts";
import { validateMultilingualTerminologyAndTranslationOperationsV2 } from "./contracts";
import { evaluateMultilingualTerminologyAndTranslationOperationsV2 } from "./policy";

export function assessRelease383(value: MultilingualTerminologyAndTranslationOperationsV2) {
  const validationErrors = validateMultilingualTerminologyAndTranslationOperationsV2(value);
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
    decision: evaluateMultilingualTerminologyAndTranslationOperationsV2(value)
  };
}
