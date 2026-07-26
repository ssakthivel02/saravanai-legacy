import type { SourceDiscoveryAndAuthorityRanking } from "./contracts";
import { validateSourceDiscoveryAndAuthorityRanking } from "./contracts";
import { evaluateSourceDiscoveryAndAuthorityRanking } from "./policy";

export function assessRelease712(value: SourceDiscoveryAndAuthorityRanking) {
  const validationErrors = validateSourceDiscoveryAndAuthorityRanking(value);
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
    decision: evaluateSourceDiscoveryAndAuthorityRanking(value)
  };
}
