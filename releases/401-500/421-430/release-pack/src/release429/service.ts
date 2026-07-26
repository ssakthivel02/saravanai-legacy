import type { CyberThreatHuntingProgramme } from "./contracts";
import { validateCyberThreatHuntingProgramme } from "./contracts";
import { evaluateCyberThreatHuntingProgramme } from "./policy";

export function assessRelease429(value: CyberThreatHuntingProgramme) {
  const validationErrors = validateCyberThreatHuntingProgramme(value);
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
    decision: evaluateCyberThreatHuntingProgramme(value)
  };
}
