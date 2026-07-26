import type { TranslationQualityAndTerminologyService } from "./contracts";
import { validateTranslationQualityAndTerminologyService } from "./contracts";
import { evaluateTranslationQualityAndTerminologyService } from "./policy";

export function assessRelease864(value: TranslationQualityAndTerminologyService) {
  const validationErrors = validateTranslationQualityAndTerminologyService(value);
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
    decision: evaluateTranslationQualityAndTerminologyService(value)
  };
}
