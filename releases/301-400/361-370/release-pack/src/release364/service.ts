import type { PublicSectorTransparencyPattern } from "./contracts";
import { validatePublicSectorTransparencyPattern } from "./contracts";
import { evaluatePublicSectorTransparencyPattern } from "./policy";

export function assessRelease364(value: PublicSectorTransparencyPattern) {
  const validationErrors = validatePublicSectorTransparencyPattern(value);
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
    decision: evaluatePublicSectorTransparencyPattern(value)
  };
}
