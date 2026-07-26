import type { TranslationQualityAndTerminologyV3 } from "./contracts";
import { validateTranslationQualityAndTerminologyV3 } from "./contracts";
import { evaluateTranslationQualityAndTerminologyV3 } from "./policy";

export function assessRelease582(value: TranslationQualityAndTerminologyV3) {
  const validationErrors = validateTranslationQualityAndTerminologyV3(value);
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
    decision: evaluateTranslationQualityAndTerminologyV3(value)
  };
}
