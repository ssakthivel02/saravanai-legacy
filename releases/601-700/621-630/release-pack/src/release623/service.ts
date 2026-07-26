import type { ChunkingEmbeddingAndIndexGovernance } from "./contracts";
import { validateChunkingEmbeddingAndIndexGovernance } from "./contracts";
import { evaluateChunkingEmbeddingAndIndexGovernance } from "./policy";

export function assessRelease623(value: ChunkingEmbeddingAndIndexGovernance) {
  const validationErrors = validateChunkingEmbeddingAndIndexGovernance(value);
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
    decision: evaluateChunkingEmbeddingAndIndexGovernance(value)
  };
}
