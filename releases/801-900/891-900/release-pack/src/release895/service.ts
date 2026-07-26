import type { EndToEndCriticalJourneyTestProgramme } from "./contracts";
import { validateEndToEndCriticalJourneyTestProgramme } from "./contracts";
import { evaluateEndToEndCriticalJourneyTestProgramme } from "./policy";

export function assessRelease895(value: EndToEndCriticalJourneyTestProgramme) {
  const validationErrors = validateEndToEndCriticalJourneyTestProgramme(value);
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
    decision: evaluateEndToEndCriticalJourneyTestProgramme(value)
  };
}
