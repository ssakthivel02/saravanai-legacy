import type { ControlDesignAndTestCatalogueV2 } from "./contracts";
import { validateControlDesignAndTestCatalogueV2 } from "./contracts";
import { evaluateControlDesignAndTestCatalogueV2 } from "./policy";

export function assessRelease682(value: ControlDesignAndTestCatalogueV2) {
  const validationErrors = validateControlDesignAndTestCatalogueV2(value);
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
    decision: evaluateControlDesignAndTestCatalogueV2(value)
  };
}
