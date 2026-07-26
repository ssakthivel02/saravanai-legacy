import type { KnowledgeGraphQualityV2 } from "./contracts";
import { validateKnowledgeGraphQualityV2 } from "./contracts";
import { evaluateKnowledgeGraphQualityV2 } from "./policy";

export function assessRelease381(value: KnowledgeGraphQualityV2) {
  const validationErrors = validateKnowledgeGraphQualityV2(value);
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
    decision: evaluateKnowledgeGraphQualityV2(value)
  };
}
