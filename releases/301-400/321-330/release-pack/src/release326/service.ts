import type { ZeroTrustServiceMesh } from "./contracts";
import { validateZeroTrustServiceMesh } from "./contracts";
import { evaluateZeroTrustServiceMesh } from "./policy";

export function assessRelease326(value: ZeroTrustServiceMesh) {
  const validationErrors = validateZeroTrustServiceMesh(value);
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
    decision: evaluateZeroTrustServiceMesh(value)
  };
}
