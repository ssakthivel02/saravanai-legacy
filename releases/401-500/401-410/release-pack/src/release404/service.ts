import type { RetrievalPipelineOrchestration } from "./contracts";
import { validateRetrievalPipelineOrchestration } from "./contracts";
import { evaluateRetrievalPipelineOrchestration } from "./policy";

export function assessRelease404(value: RetrievalPipelineOrchestration) {
  const validationErrors = validateRetrievalPipelineOrchestration(value);
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
    decision: evaluateRetrievalPipelineOrchestration(value)
  };
}
