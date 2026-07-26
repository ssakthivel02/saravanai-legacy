import type { ManagementAssertionAndDisclosureControl } from "./contracts";
import { validateManagementAssertionAndDisclosureControl } from "./contracts";
import { evaluateManagementAssertionAndDisclosureControl } from "./policy";

export function assessRelease688(value: ManagementAssertionAndDisclosureControl) {
  const validationErrors = validateManagementAssertionAndDisclosureControl(value);
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
    decision: evaluateManagementAssertionAndDisclosureControl(value)
  };
}
