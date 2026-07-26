import type { VideoStoryboardAndGenerationPipeline } from "./contracts";
import { validateVideoStoryboardAndGenerationPipeline } from "./contracts";
import { evaluateVideoStoryboardAndGenerationPipeline } from "./policy";

export function assessRelease644(value: VideoStoryboardAndGenerationPipeline) {
  const validationErrors = validateVideoStoryboardAndGenerationPipeline(value);
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
    decision: evaluateVideoStoryboardAndGenerationPipeline(value)
  };
}
