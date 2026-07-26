import type { AccessibleDesignSystemV2 } from "./contracts";
import { validateAccessibleDesignSystemV2 } from "./contracts";
import { evaluateAccessibleDesignSystemV2 } from "./policy";

export function assessRelease584(value: AccessibleDesignSystemV2) {
  const validationErrors = validateAccessibleDesignSystemV2(value);
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
    decision: evaluateAccessibleDesignSystemV2(value)
  };
}
