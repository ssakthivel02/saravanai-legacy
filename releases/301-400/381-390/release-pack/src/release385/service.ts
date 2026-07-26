import type { ChildSafeLearningAndFamilyControlsV2 } from "./contracts";
import { validateChildSafeLearningAndFamilyControlsV2 } from "./contracts";
import { evaluateChildSafeLearningAndFamilyControlsV2 } from "./policy";

export function assessRelease385(value: ChildSafeLearningAndFamilyControlsV2) {
  const validationErrors = validateChildSafeLearningAndFamilyControlsV2(value);
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
    decision: evaluateChildSafeLearningAndFamilyControlsV2(value)
  };
}
