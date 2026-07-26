import type { InclusivePersonalisationAndUserControls } from "./contracts";
import { validateInclusivePersonalisationAndUserControls } from "./contracts";
import { evaluateInclusivePersonalisationAndUserControls } from "./policy";

export function assessRelease586(value: InclusivePersonalisationAndUserControls) {
  const validationErrors = validateInclusivePersonalisationAndUserControls(value);
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
    decision: evaluateInclusivePersonalisationAndUserControls(value)
  };
}
