import type { SakthiAIEnterpriseProgrammeV3CompletionGate } from "./contracts";
import { validateSakthiAIEnterpriseProgrammeV3CompletionGate } from "./contracts";
import { evaluateSakthiAIEnterpriseProgrammeV3CompletionGate } from "./policy";

export function assessRelease400(value: SakthiAIEnterpriseProgrammeV3CompletionGate) {
  const validationErrors = validateSakthiAIEnterpriseProgrammeV3CompletionGate(value);
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
    decision: evaluateSakthiAIEnterpriseProgrammeV3CompletionGate(value)
  };
}
