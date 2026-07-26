import type { EmailDraftingAndRecipientSafety } from "./contracts";
import { validateEmailDraftingAndRecipientSafety } from "./contracts";
import { evaluateEmailDraftingAndRecipientSafety } from "./policy";

export function assessRelease732(value: EmailDraftingAndRecipientSafety) {
  const validationErrors = validateEmailDraftingAndRecipientSafety(value);
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
    decision: evaluateEmailDraftingAndRecipientSafety(value)
  };
}
