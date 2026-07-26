import type { MultimodalProjectAndAssetWorkspace } from "./contracts";
import { validateMultimodalProjectAndAssetWorkspace } from "./contracts";
import { evaluateMultimodalProjectAndAssetWorkspace } from "./policy";

export function assessRelease641(value: MultimodalProjectAndAssetWorkspace) {
  const validationErrors = validateMultimodalProjectAndAssetWorkspace(value);
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
    decision: evaluateMultimodalProjectAndAssetWorkspace(value)
  };
}
