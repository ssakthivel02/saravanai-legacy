import type { SovereignAIDeploymentProfile } from "./contracts";
import { validateSovereignAIDeploymentProfile } from "./contracts";
import { evaluateSovereignAIDeploymentProfile } from "./policy";

export function assessRelease411(value: SovereignAIDeploymentProfile) {
  const validationErrors = validateSovereignAIDeploymentProfile(value);
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
    decision: evaluateSovereignAIDeploymentProfile(value)
  };
}
