import type { WebsiteAndWebApplicationScaffold } from "./contracts";
import { validateWebsiteAndWebApplicationScaffold } from "./contracts";
import { evaluateWebsiteAndWebApplicationScaffold } from "./policy";

export function assessRelease723(value: WebsiteAndWebApplicationScaffold) {
  const validationErrors = validateWebsiteAndWebApplicationScaffold(value);
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
    decision: evaluateWebsiteAndWebApplicationScaffold(value)
  };
}
