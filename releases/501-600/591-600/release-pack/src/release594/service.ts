import type { ProductAndPlatformRoadmapGovernanceV2 } from "./contracts";
import { validateProductAndPlatformRoadmapGovernanceV2 } from "./contracts";
import { evaluateProductAndPlatformRoadmapGovernanceV2 } from "./policy";

export function assessRelease594(value: ProductAndPlatformRoadmapGovernanceV2) {
  const validationErrors = validateProductAndPlatformRoadmapGovernanceV2(value);
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
    decision: evaluateProductAndPlatformRoadmapGovernanceV2(value)
  };
}
