import type { AudioGenerationAndVoiceSafety } from "./contracts";
import { validateAudioGenerationAndVoiceSafety } from "./contracts";
import { evaluateAudioGenerationAndVoiceSafety } from "./policy";

export function assessRelease513(value: AudioGenerationAndVoiceSafety) {
  const validationErrors = validateAudioGenerationAndVoiceSafety(value);
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
    decision: evaluateAudioGenerationAndVoiceSafety(value)
  };
}
