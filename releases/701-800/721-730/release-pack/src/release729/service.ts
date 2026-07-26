import type { DeploymentPreviewAndReleasePromotion } from "./contracts";
import { validateDeploymentPreviewAndReleasePromotion } from "./contracts";
import { evaluateDeploymentPreviewAndReleasePromotion } from "./policy";

export function assessRelease729(value: DeploymentPreviewAndReleasePromotion) {
  const validationErrors = validateDeploymentPreviewAndReleasePromotion(value);
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
    decision: evaluateDeploymentPreviewAndReleasePromotion(value)
  };
}
