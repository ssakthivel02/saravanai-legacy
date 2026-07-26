import type { ComplaintRedressAndOmbudsmanReadiness } from "./contracts";
import { validateComplaintRedressAndOmbudsmanReadiness } from "./contracts";
import { evaluateComplaintRedressAndOmbudsmanReadiness } from "./policy";

export function assessRelease357(value: ComplaintRedressAndOmbudsmanReadiness) {
  const validationErrors = validateComplaintRedressAndOmbudsmanReadiness(value);
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
    decision: evaluateComplaintRedressAndOmbudsmanReadiness(value)
  };
}
