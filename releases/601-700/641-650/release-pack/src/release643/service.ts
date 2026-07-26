import type { AudioAndVoiceProductionPipeline } from "./contracts";
import { validateAudioAndVoiceProductionPipeline } from "./contracts";
import { evaluateAudioAndVoiceProductionPipeline } from "./policy";

export function assessRelease643(value: AudioAndVoiceProductionPipeline) {
  const validationErrors = validateAudioAndVoiceProductionPipeline(value);
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
    decision: evaluateAudioAndVoiceProductionPipeline(value)
  };
}
