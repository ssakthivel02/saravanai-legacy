import type { GitOpsEnvironmentPromotion } from "./contracts";
import { validateGitOpsEnvironmentPromotion } from "./contracts";
import { evaluateGitOpsEnvironmentPromotion } from "./policy";

export function assessRelease332(value: GitOpsEnvironmentPromotion) {
  const validationErrors = validateGitOpsEnvironmentPromotion(value);
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
    decision: evaluateGitOpsEnvironmentPromotion(value)
  };
}
