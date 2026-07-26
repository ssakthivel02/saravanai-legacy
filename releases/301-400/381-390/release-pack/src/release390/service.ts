import type { KnowledgeTrustAssuranceGate } from "./contracts";
import { validateKnowledgeTrustAssuranceGate } from "./contracts";
import { evaluateKnowledgeTrustAssuranceGate } from "./policy";

export function assessRelease390(value: KnowledgeTrustAssuranceGate) {
  const validationErrors = validateKnowledgeTrustAssuranceGate(value);
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
    decision: evaluateKnowledgeTrustAssuranceGate(value)
  };
}
