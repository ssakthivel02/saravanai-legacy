import type { TestIntelligenceAndCoverageRisk } from "./contracts";
import { validateTestIntelligenceAndCoverageRisk } from "./contracts";
import { evaluateTestIntelligenceAndCoverageRisk } from "./policy";

export function assessRelease473(value: TestIntelligenceAndCoverageRisk) {
  const validationErrors = validateTestIntelligenceAndCoverageRisk(value);
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
    decision: evaluateTestIntelligenceAndCoverageRisk(value)
  };
}
