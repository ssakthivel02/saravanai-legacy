import type { PublicInformationCorrectionAndTransparency } from "./contracts";
import { validatePublicInformationCorrectionAndTransparency } from "./contracts";
import { evaluatePublicInformationCorrectionAndTransparency } from "./policy";

export function assessRelease388(value: PublicInformationCorrectionAndTransparency) {
  const validationErrors = validatePublicInformationCorrectionAndTransparency(value);
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
    decision: evaluatePublicInformationCorrectionAndTransparency(value)
  };
}
