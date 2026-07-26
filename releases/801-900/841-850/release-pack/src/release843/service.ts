import type { ProjectConversationAndActivityStream } from "./contracts";
import { validateProjectConversationAndActivityStream } from "./contracts";
import { evaluateProjectConversationAndActivityStream } from "./policy";

export function assessRelease843(value: ProjectConversationAndActivityStream) {
  const validationErrors = validateProjectConversationAndActivityStream(value);
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
    decision: evaluateProjectConversationAndActivityStream(value)
  };
}
