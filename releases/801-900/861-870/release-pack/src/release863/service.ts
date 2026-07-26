import type { LocaleLanguageAndContentRuntime } from "./contracts";
import { validateLocaleLanguageAndContentRuntime } from "./contracts";
import { evaluateLocaleLanguageAndContentRuntime } from "./policy";

export function assessRelease863(value: LocaleLanguageAndContentRuntime) {
  const validationErrors = validateLocaleLanguageAndContentRuntime(value);
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
    decision: evaluateLocaleLanguageAndContentRuntime(value)
  };
}
